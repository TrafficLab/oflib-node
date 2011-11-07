/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

var util = require('util');
var ofp = require('./ofp.js');
var packet = require('./packet.js');
var ofputil = require('./util.js');

var unpackAction      = require('./unpack_action.js');
var unpackInstruction = require('./unpack_instruction.js');

/*
 * Returns:
 * {"<struct>" : <JSON>, "offset" : <offset after instruction> }
 * Error:
 * {"error" : "<error text> [, "ofp_error" : {"type" : <type>, "code" : <code>}]}
 */
module.exports = {
        "bucket" : function bucket_unpack(buffer, offset) {
                var bucket = {};

                if (buffer.length < offset + ofp.sizes.ofp_bucket) {
                    return {
                        "error" : util.format('Received bucket is too short (%d).', (buffer.length - offset)),
                        "ofp_error" : {"type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'}
                    }
                }

                var len  = buffer.readUInt16BE(offset, true);

                if (len < ofp.sizes.ofp_bucket) {
                    return {
                        "error" : util.format('Received bucket is too short (%d).', len),
                        "ofp_error" : {"type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'}
                    }
                }

                if (buffer.length < offset + len) {
                    return {
                        "error" : util.format('Received bucket is too short (%d).', (buffer.length - offset)),
                        "ofp_error" : {"type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'}
                    }
                }
                offset += 2;

                ofputil.setIfNotEq(bucket, "weight", buffer.readUInt16BE(offset, true), 0);
                ofputil.setIfNotEq(bucket, 'watch_port', buffer.readUInt32BE(offset + 2, true), ofp.ofp_port_no.OFPP_ANY);
                ofputil.setIfNotEq(bucket, 'watch_group', buffer.readUInt32BE(offset + 6, true), ofp.ofp_group.OFPG_ANY);
                offset += 14; /* + pad */

                bucket.actions = [];
                var actEnd = offset + len - ofp.sizes.ofp_bucket;
                while (offset + 7 < actEnd) { /* bucket is padded! */
                    var unpack = unpackAction(buffer, offset);
                    if ('error' in unpack) {
                        return unpack;
                    }
                    bucket.actions.push(unpack.action);
                    offset = unpack.offset;
                }

                offset = actEnd;

                return {"bucket" : bucket, "offset" : offset};
            },

        "flowStats" : function flowStats_unpack(buffer, offset) {
                var flowStats = {};

                if (buffer.length < offset + ofp.sizes.ofp_flow_stats) {
                    return {
                        "error" : util.format('Received flow_stats is too short (%d).', (buffer.length - offset))
                    }
                }

                var len  = buffer.readUInt16BE(offset, true);

                // NOTE: ofp_flow_stats contains a standard match
                if (len < ofp.sizes.ofp_flow_stats) {
                    return {
                        "error" : util.format('Received flow_stats is too short (%d).', len)
                    }
                }

                if (buffer.length < offset + len) {
                    return {
                        "error" : util.format('Received flow_stats is too short (%d).', (buffer.length - offset))
                    }
                }
                offset += 2;

                // TODO sanity check
                flowStats.table_id = buffer.readUInt8(offset);
                offset += 2; /* + pad */

                flowStats.duration_sec = buffer.readUInt32BE(offset);
                flowStats.duration_nsec = buffer.readUInt32BE(offset + 4);
                flowStats.priority = buffer.readUInt16BE(offset + 8, true);
                offset += 10;

                var idle_timeout = buffer.readUInt16BE(offset);
                if (idle_timeout != 0) {
                    flowStats.idle_timeout = idle_timeout;
                }
                offset += 2;

                var hard_timeout = buffer.readUInt16BE(offset);
                if (hard_timeout != 0) {
                    flowStats.hard_timeout = hard_timeout;
                }
                offset += 8; /* + pad */

                flowStats.cookie = buffer.toString('hex', offset, offset + 8);
                offset += 8;

                flowStats.packet_count = {"high" : buffer.readUInt32BE(offset, true),
                                          "low" :  buffer.readUInt32BE(offset + 4, true)};
                offset += 8;

                flowStats.byte_count = {"high" : buffer.readUInt32BE(offset, true),
                                        "low" :  buffer.readUInt32BE(offset + 4, true)};
                offset += 8;

                var unpack = module.exports.match(buffer, offset);
                if ('error' in unpack) {
                    return unpack;
                }
                flowStats.match = unpack.match;
                offset = unpack.offset;

                flowStats.instructions = [];
                // NOTE: ofp_flow_stats does contain a standard match structure!
                var instEnd = offset + len - ofp.sizes.ofp_flow_stats;
                while (offset < instEnd) {
                    var unpack = unpackInstruction(buffer, offset);
                    if ('error' in unpack) {
                        return unpack;
                    }
                    flowStats.instructions.push(unpack.instruction);
                    offset = unpack.offset;
                }

                if (offset != instEnd) {
                    return {
                        "error" : util.format('The received flowStats contained extra bytes (%d).', (insttEnd - offset)),
                    }
                }

                return {"flow-stats" : flowStats, "offset" : offset};
            },

        "groupStats" : function groupStats_unpack(buffer, offset) {
                var groupStats = {};

                if (buffer.length < offset + ofp.sizes.ofp_group_stats) {
                    return {
                        "error" : util.format('Received group_stats is too short (%d).', (buffer.length - offset))
                    }
                }

                var len  = buffer.readUInt16BE(offset, true);

                if (len < ofp.sizes.ofp_group_stats) {
                    return {
                        "error" : util.format('Received group_stats is too short (%d).', len)
                    }
                }

                if (buffer.length < offset + len) {
                    return {
                        "error" : util.format('Received group_stats is too short (%d).', (buffer.length - offset))
                    }
                }
                offset += 4; /* + pad */

                groupStats.group_id = buffer.readUInt32BE(offset, true);
                if (groupStats.group_id > ofp.ofp_group.OFPG_MAX) {
                    return {
                        "error" : util.format('Received group_stats has invalid group_id (%d).', groupStats.group_id)
                    }
                }
                offset += 4;

                groupStats.ref_count = buffer.readUInt32BE(offset, 4);
                offset += 8; /* + pad */

                groupStats.packet_count = {"high" : buffer.readUInt32BE(offset, true),
                                           "low" :  buffer.readUInt32BE(offset + 4, true)};
                offset += 8;

                groupStats.byte_count = {"high" : buffer.readUInt32BE(offset, true),
                                         "low" :  buffer.readUInt32BE(offset + 4, true)};
                offset += 8;

                groupStats.bucket_stats = [];

                var statEnd = offset + len - ofp.sizes.ofp_group_stats;
                while (offset < statEnd) {
                    var unpack = module.exports.bucketCounter(buffer, offset);
                    if ('error' in unpack) {
                        return unpack;
                    }
                    groupStats.bucket_stats.push(unpack['bucket-counter']);
                    offset = unpack.offset;
                }

                if (offset != statEnd) {
                    return {
                        "error" : util.format('The received groupStats contained extra bytes (%d).', (insttEnd - offset)),
                    }
                }
                return {"group-stats" : groupStats, "offset" : offset};
            },

        "queueProp" : function queueProp_unpack(buffer, offset) {
                var queueProp = {};

                if (buffer.length < offset + ofp.sizes.ofp_queue_prop_header) {
                    return {
                        "error" : util.format('Received queue_prop is too short (%d).', (buffer.length - offset))
                    }
                }

                var property = buffer.readUInt16BE(offset, true);
                var len  = buffer.readUInt16BE(offset + 2, true);

                if (len < ofp.sizes.ofp_queue_prop_header) {
                    return {
                        "error" : util.format('Received queue_prop is too short (%d).', len)
                    }
                }

                if (buffer.length < offset + len) {
                    return {
                        "error" : util.format('Received queue_prop is too short (%d).', (buffer.length - offset))
                    }
                }
                offset += 8; /* + pad */ // queue prop header's pad is in props as well

                switch (property) {
                    /* TODO: Implement experimenter callbacks */
                    case ofp.ofp_queue_properties.OFPQT_MIN_RATE: {
                        var queueProp = {
                                "header" : {"property" : 'OFPQT_MIN_RATE'},
                                "body" : {}
                        };

                        if (len != ofp.sizes.ofp_queue_prop_min_rate) {
                            return {
                                "error" : util.format('Received queue_prop has invalid length (%d).', l)
                            }
                        }

                        var rate = buffer.readUInt16BE(offset, true);
                        if (rate <= 1000) {
                            queueProp.body.rate = rate;
                        }
                        offset += 8; /* + pad */

                        return {"queue-prop" : queueProp, "offset" : offset};
                    }

                    default: {
                        return {
                            "error" : util.format('Received queue-prop has unknown type (%d).', property)
                        }
                    }
                }

            },

        "packetQueue" : function packetQueue_unpack(buffer, offset) {
                var packetQueue = {};

                if (buffer.length < offset + ofp.sizes.ofp_packet_queue) {
                    return {
                        "error" : util.format('Received packet_queue is too short (%d).', (buffer.length - offset))
                    }
                }


                var len  = buffer.readUInt16BE(offset + 4, true);


                if (len < ofp.sizes.ofp_packet_queue) {
                    return {
                        "error" : util.format('Received packet_queue is too short (%d).', (buffer.length - offset))
                    }
                }

                if (buffer.length < offset + len) {
                    return {
                        "error" : util.format('Received packet_queue is too short (%d).', (buffer.length - offset))
                    }
                }

                packetQueue.queue_id = buffer.readUInt32BE(offset, true);
                if (packetQueue.queue_id == ofp.OFPQ_ALL) {
                    return {
                        "error" : util.format('Received packet_queue has invalid queue_id (%d).', packetQueue.queue_id)
                    }
                }
                offset += 8; /* + pad */

                packetQueue.properties = [];

                var propEnd = offset + len - ofp.sizes.ofp_packet_queue;
                while (offset < propEnd) {
                    var unpack = module.exports.queueProp(buffer, offset);
                    if ('error' in unpack) {
                        return unpack;
                    }
                    packetQueue.properties.push(unpack['queue-prop']);
                    offset = unpack.offset;
                }

                if (offset != propEnd) {
                    return {
                        "error" : util.format('The received packet queue contained extra bytes (%d).', (insttEnd - offset)),
                    }
                }
                return {"packet-queue" : packetQueue, "offset" : offset};
            },

        "port" : function port_unpack(buffer, offset) {
                var port = {};

                if (buffer.length < offset + ofp.sizes.ofp_port) {
                    return {
                        "error" : util.format('Received port is too short (%d).', (buffer.length - offset))
                    }
                }

                port.port_no = buffer.readUInt32BE(offset, true);
                offset += 8; /* + pad */

                if (port.port_no > ofp.ofp_port_no.OFPP_MAX && port.port_no != ofp.ofp_port_no.OFPP_LOCAL) {
                    return {
                        "error" : util.format('Received port has invalid port_no (%d).', port.port_no)
                    }
                }

                if (port.port_no == ofp.ofp_port_no.OFPP_LOCAL) {
                    port.port_no = 'OFPP_LOCAL';
                }

                port.hw_addr = packet.ethToString(buffer, offset);
                offset += ofp.OFP_ETH_ALEN + 2; /* + pad */

                port.name = buffer.toString('utf8', offset, offset + ofp.OFP_MAX_PORT_NAME_LEN);
                port.name = port.name.substr(0, port.name.indexOf('\0'));
                offset += ofp.OFP_MAX_PORT_NAME_LEN;

                var config = buffer.readUInt32BE(offset, true);
                var configParsed = ofputil.parseFlags(config, ofp.ofp_port_config);
                if (configParsed.remain != 0) {
                    return {
                        "error" : util.format('Received port has invalid config (%d).', config)
                    }
                }
                port.config = configParsed.array;
                offset += 4;

                var state = buffer.readUInt32BE(offset, true);
                var stateParsed = ofputil.parseFlags(state, ofp.ofp_port_state);
                if (stateParsed.remain != 0) {
                    return {
                        "error" : util.format('Received port has invalid state (%d).', state)
                    }
                }
                port.state = stateParsed.array;
                offset += 4;

                var curr = buffer.readUInt32BE(offset, true);
                if (curr != 0) {
                    var currParsed = ofputil.parseFlags(curr, ofp.ofp_port_features);
                    if (currParsed.remain != 0) {
                        return {
                            "error" : util.format('Received port has invalid curr (%d).', curr)
                        }
                    }
                    port.curr = currParsed.array;
                }
                offset += 4;

                var advertised = buffer.readUInt32BE(offset, true);
                if (advertised != 0) {
                    var advertisedParsed = ofputil.parseFlags(advertised, ofp.ofp_port_features);
                    if (advertisedParsed.remain != 0) {
                        return {
                            "error" : util.format('Received port has invalid advertised (%d).', advertised)
                        }
                    }
                    port.advertised = advertisedParsed.array;
                }
                offset += 4;

                var supported = buffer.readUInt32BE(offset, true);
                if (supported != 0) {
                    var supportedParsed = ofputil.parseFlags(supported, ofp.ofp_port_features);
                    if (supportedParsed.remain != 0) {
                        return {
                            "error" : util.format('Received port has invalid supported (%d).', supported)
                        }
                    }
                    port.supported = supportedParsed.array;
                }
                offset += 4;

                var peer = buffer.readUInt32BE(offset, true);
                if (peer != 0) {
                    var peerParsed = ofputil.parseFlags(peer, ofp.ofp_port_features);
                    if (peerParsed.remain != 0) {
                        return {
                            "error" : util.format('Received port has invalid peer (%d).', peer)
                        }
                    }
                    port.peer = peerParsed.array;
                }
                offset += 4;

                port.curr_speed = buffer.readUInt32BE(offset, true);
                port.max_speed = buffer.readUInt32BE(offset + 4, true);
                offset += 8;

                return {"port" : port, "offset" : offset};
            },

        "tableStats" : function tableStats_unpack(buffer, offset) {
                var tableStats = {};

                if (buffer.length < offset + ofp.sizes.ofp_table_stats) {
                    return {
                        "error" : util.format('Received table_stats is too short (%d).', (buffer.length - offset)),
                        "ofp_error" : {"type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'}
                    }
                }

                tableStats.table_id = buffer.readUInt8(offset, true);
                if (tableStats.table_id > ofp.ofp_table.OFPTT_MAX) {
                    return {
                        "error" : util.format('Received table_stats has invalid group_id (%d).', groupStats.group_id)
                    }
                }
                offset += 8; /* + pad */

                tableStats.name = buffer.toString('utf8', offset, offset + ofp.OFP_MAX_TABLE_NAME_LEN);
                tableStats.name = tableStats.name.substr(0, tableStats.name.indexOf('\0'));
                offset += ofp.OFP_MAX_TABLE_NAME_LEN;

                var wildcards = buffer.readUInt32BE(offset, true);
                var wildcardsParsed = ofputil.parseFlags(wildcards, ofp.ofp_flow_wildcards);
                if (wildcardsParsed.remain != 0) {
                    return {
                        "error" : util.format('Received port has invalid wildcards (%d).', wildcards)
                    }
                }
                tableStats.wildcards = wildcardsParsed.array;
                offset += 4;

                var match = buffer.readUInt32BE(offset, true);
                var matchParsed = ofputil.parseFlags(match, ofp.ofp_flow_match_fields);
                if (matchParsed.remain != 0) {
                    return {
                        "error" : util.format('Received port has invalid match (%d).', match)
                    }
                }
                tableStats.match = matchParsed.array;
                offset += 4;

                var instructions = buffer.readUInt32BE(offset, true);
                var instructionsParsed = ofputil.parseFlags(instructions, ofp.ofp_instruction_type_flags);
                if (instructionsParsed.remain != 0) {
                    return {
                        "error" : util.format('Received port has invalid instruction (%d).', instructions)
                    }
                }
                tableStats.instructions = instructionsParsed.array;
                offset += 4;

                var write_actions = buffer.readUInt32BE(offset, true);
                var write_actionsParsed = ofputil.parseFlags(write_actions, ofp.ofp_action_type_flags);
                if (write_actionsParsed.remain != 0) {
                    return {
                        "error" : util.format('Received port has invalid write_actions (%d).', write_actions)
                    }
                }
                tableStats.write_actions = write_actionsParsed.array;
                offset += 4;

                var apply_actions = buffer.readUInt32BE(offset, true);
                var apply_actionsParsed = ofputil.parseFlags(apply_actions, ofp.ofp_action_type_flags);
                if (apply_actionsParsed.remain != 0) {
                    return {
                        "error" : util.format('Received port has invalid apply_actions (%d).', apply_actions)
                    }
                }
                tableStats.apply_actions = apply_actionsParsed.array;
                offset += 4;

                var config = buffer.readUInt32BE(offset, true);
                var configParsed = ofputil.parseFlags(config, ofp.ofp_table_config);
                if (configParsed.remain != 0) {
                    return {
                        "error" : util.format('Received port has invalid config (%d).', config)
                    }
                }
                tableStats.config = configParsed.array;
                offset += 4;

                tableStats.max_entries = buffer.readUInt32BE(offset, true);
                tableStats.active_count = buffer.readUInt32BE(offset + 4, true);
                offset += 8;

                tableStats.lookup_count = {"high" : buffer.readUInt32BE(offset, true),
                                           "low" : buffer.readUInt32BE(offset + 4, true)};
                offset += 8;

                tableStats.matched_count = {"high" : buffer.readUInt32BE(offset, true),
                                            "low" : buffer.readUInt32BE(offset + 4, true)};
                offset += 8;

                return {"table-stats" : tableStats, "offset" : offset};
            },

        "portStats" : function portStats_unpack(buffer, offset) {
                var portStats = {};

                if (buffer.length < offset + ofp.sizes.ofp_port_stats) {
                    return {
                        "error" : util.format('Received port_stats is too short (%d).', (buffer.length - offset))
                    }
                }

                portStats.port_no = buffer.readUInt32BE(offset, true);
                if (portStats.port_no > ofp.ofp_port_no.OFPP_MAX) {
                    return {
                        "error" : util.format('Received portStats has invalid port_no (%d).', portStats.port_no),
                    }
                }
                offset += 8; /* + pad */

                var high = buffer.readUInt32BE(offset, true);
                var low = buffer.readUInt32BE(offset + 4, true);
                if (high != 0xffffffff || low != 0xffffffff) {
                    portStats.rx_packets = {"high" : high, "low" : low};
                }
                offset += 8;

                high = buffer.readUInt32BE(offset, true);
                low = buffer.readUInt32BE(offset + 4, true);
                if (high != 0xffffffff || low != 0xffffffff) {
                    portStats.tx_packets = {"high" : high, "low" : low};
                }
                offset += 8;

                high = buffer.readUInt32BE(offset, true);
                low = buffer.readUInt32BE(offset + 4, true);
                if (high != 0xffffffff || low != 0xffffffff) {
                    portStats.rx_bytes = {"high" : high, "low" : low};
                }
                offset += 8;

                high = buffer.readUInt32BE(offset, true);
                low = buffer.readUInt32BE(offset + 4, true);
                if (high != 0xffffffff || low != 0xffffffff) {
                    portStats.tx_bytes = {"high" : high, "low" : low};
                }
                offset += 8;

                high = buffer.readUInt32BE(offset, true);
                low = buffer.readUInt32BE(offset + 4, true);
                if (high != 0xffffffff || low != 0xffffffff) {
                    portStats.rx_dropped = {"high" : high, "low" : low};
                }
                offset += 8;

                high = buffer.readUInt32BE(offset, true);
                low = buffer.readUInt32BE(offset + 4, true);
                if (high != 0xffffffff || low != 0xffffffff) {
                    portStats.tx_dropped = {"high" : high, "low" : low};
                }
                offset += 8;

                high = buffer.readUInt32BE(offset, true);
                low = buffer.readUInt32BE(offset + 4, true);
                if (high != 0xffffffff || low != 0xffffffff) {
                    portStats.rx_errors = {"high" : high, "low" : low};
                }
                offset += 8;

                high = buffer.readUInt32BE(offset, true);
                low = buffer.readUInt32BE(offset + 4, true);
                if (high != 0xffffffff || low != 0xffffffff) {
                    portStats.tx_errors = {"high" : high, "low" : low};
                }
                offset += 8;

                high = buffer.readUInt32BE(offset, true);
                low = buffer.readUInt32BE(offset + 4, true);
                if (high != 0xffffffff || low != 0xffffffff) {
                    portStats.rx_frame_err = {"high" : high, "low" : low};
                }
                offset += 8;

                high = buffer.readUInt32BE(offset, true);
                low = buffer.readUInt32BE(offset + 4, true);
                if (high != 0xffffffff || low != 0xffffffff) {
                    portStats.rx_over_err = {"high" : high, "low" : low};
                }
                offset += 8;

                high = buffer.readUInt32BE(offset, true);
                low = buffer.readUInt32BE(offset + 4, true);
                if (high != 0xffffffff || low != 0xffffffff) {
                    portStats.rx_crc_err = {"high" : high, "low" : low};
                }
                offset += 8;

                high = buffer.readUInt32BE(offset, true);
                low = buffer.readUInt32BE(offset + 4, true);
                if (high != 0xffffffff || low != 0xffffffff) {
                    portStats.collisions = {"high" : high, "low" : low};
                }
                offset += 8;

                return {"port-stats" : portStats, "offset" : offset};
            },

        "queueStats" : function queueStats_unpack(buffer, offset) {
                var queueStats = {};

                if (buffer.length < offset + ofp.sizes.ofp_queue_stats) {
                    return {
                        "error" : util.format('Received queue_stats is too short (%d).', (buffer.length - offset)),
                        "ofp_error" : {"type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'}
                    }
                }

                queueStats.port_no = buffer.readUInt32BE(offset, true);
                if (queueStats.port_no > ofp.ofp_port_no.OFPP_MAX) {
                    return {
                        "error" : util.format('Received queueStats has invalid port_no (%d).', queueStats.port_no),
                    }
                }
                offset += 4;

                queueStats.queue_id = buffer.readUInt32BE(offset, true);
                if (queueStats.queue_id > ofp.OFPQ_MAX) {
                    return {
                        "error" : util.format('Received queueStats has invalid queue_id (%d).', queueStats.queue_id),
                    }
                }
                offset += 4;

                high = buffer.readUInt32BE(offset, true);
                low = buffer.readUInt32BE(offset + 4, true);
                if (high != 0xffffffff || low != 0xffffffff) {
                    queueStats.tx_bytes = {"high" : high, "low" : low};
                }
                offset += 8;

                var high = buffer.readUInt32BE(offset, true);
                var low = buffer.readUInt32BE(offset + 4, true);
                if (high != 0xffffffff || low != 0xffffffff) {
                    queueStats.tx_packets = {"high" : high, "low" : low};
                }
                offset += 8;

                high = buffer.readUInt32BE(offset, true);
                low = buffer.readUInt32BE(offset + 4, true);
                if (high != 0xffffffff || low != 0xffffffff) {
                    queueStats.tx_errors = {"high" : high, "low" : low};
                }
                offset += 8;

                return {"queue-stats" : queueStats, "offset" : offset};
            },

        "groupDescStats" : function groupDescStats(buffer, offset) {
                var groupDescStats = {};

                if (buffer.length < offset + ofp.sizes.ofp_group_desc_stats) {
                    return {
                        "error" : util.format('Received group_desc_stats is too short (%d).', (buffer.length - offset)),
                        "ofp_error" : {"type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'}
                    }
                }

                var len  = buffer.readUInt16BE(offset, true);

                if (len < ofp.sizes.ofp_group_desc_stats) {
                    return {
                        "error" : util.format('Received flow_stats is too short (%d).', len)
                    }
                }

                if (buffer.length < offset + len) {
                    return {
                        "error" : util.format('Received group_desc_stats is too short (%d).', (buffer.length - offset)),
                        "ofp_error" : {"type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'}
                    }
                }
                offset += 2;

                if (!ofputil.setEnum(groupDescStats, 'type', buffer.readUInt8(offset, true), ofp.ofp_group_type_rev)) {
                    return {
                        "error" : util.format('Received groupDescStats has invalid type (%d).', buffer.readUInt8(offset, true)),
                    }
                }
                offset += 2; /* + pad */

                //TODO sanity check command vs type
                groupDescStats.group_id = buffer.readUInt32BE(offset, true);

                if (groupDescStats.group_id > ofp.ofp_group.OFPG_MAX) {
                    return {
                        "error" : util.format('Received groupDescStats  message has invalid group_id (%d).', groupDescStats.group_id),
                    }
                }
                offset += 4;

                groupDescStats.buckets = [];

                var bucketEnd = offset + len - ofp.sizes.ofp_group_desc_stats;
                while (offset < bucketEnd) {
                    var unpack = module.exports.bucket(buffer, offset);
                    if ('error' in unpack) {
                        return unpack;
                    }
                    groupDescStats.buckets.push(unpack.bucket);
                    offset = unpack.offset;
                }

                if (offset != bucketEnd) {
                    return {
                        "error" : util.format('The received groupDescStats contained extra bytes (%d).', (insttEnd - offset)),
                    }
                }

                return {"group-desc-stats" : groupDescStats, "offset" : offset};
            },

        "bucketCounter" : function bucketCounter(buffer, offset) {
                var bucketCounter = {};

                if (buffer.length < offset + ofp.sizes.ofp_bucket_counter) {
                    return {
                        "error" : util.format('Received bucket_counter is too short (%d).', (buffer.length - offset)),
                        "ofp_error" : {"type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'}
                    }
                }

                bucketCounter.packet_count = {"high" : buffer.readUInt32BE(offset, true),
                                              "low" :  buffer.readUInt32BE(offset + 4, true)};
                offset += 8;

                bucketCounter.byte_count = {"high" : buffer.readUInt32BE(offset, true),
                                            "low" :  buffer.readUInt32BE(offset + 4, true)};
                offset += 8;

                return {"bucket-counter" : bucketCounter, "offset" : offset};
            },

        // TODO: Binary compare masks before printing...
        "match" : function match_unpack(buffer, offset) {
                if (buffer.length < offset + ofp.sizes.match) {
                    return {
                        "error" : util.format('Received match is too short (%d).', (buffer.length - offset)),
                        "ofp_error" : {"type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'}
                    }
                }

                var type = buffer.readUInt16BE(offset, true);
                var len  = buffer.readUInt16BE(offset + 2, true);

                if (buffer.length < offset + len) {
                    return {
                        "error" : util.format('Received match is too short (%d).', (buffer.length - offset)),
                        "ofp_error" : {"type" : 'OFPET_BAD_MATCH', "code" : 'OFPBMC_BAD_LEN'}
                    }
                }
                offset += 4;

                switch (type) {
                    /* TODO: Implement experimenter callbacks */
                    case ofp.ofp_match_type.OFPMT_STANDARD: {
                        // TODO: some validation missing?
                        var match = {
                            "header" : {"type" : 'OFMPT_STANDARD'},
                            "body" : {}
                        }

                        if (len != ofp.sizes.ofp_match_standard) {
                            return {
                                "error" : util.format('Received match is too short (%d).', (buffer.length - offset)),
                                "ofp_error" : {"type" : 'OFPET_BAD_MATCH', "code" : 'OFPBMC_BAD_LEN'}
                            }
                        }

                        var wildcards = buffer.readUInt32BE(offset + 4, true); // skipping in_port
                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_IN_PORT) == 0) {
                            match.body.in_port = buffer.readUInt32BE(offset, true);
                        }
                        offset += 8; // including wildcards

                        match.body.dl_src = packet.ethToString(buffer, offset);
                        offset += 6;
                        match.body.dl_src_mask = packet.ethToString(buffer, offset);
                        offset += 6;

                        if (match.body.dl_src_mask == '00:00:00:00:00:00') {
                            delete match.body.dl_src_mask;
                        }

                        if (match.body.dl_src_mask == 'ff:ff:ff:ff:ff:ff') {
                            delete match.body.dl_src;
                            delete match.body.dl_src_mask;
                        }

                        match.body.dl_dst = packet.ethToString(buffer, offset);
                        offset += 6;
                        match.body.dl_dst_mask = packet.ethToString(buffer, offset);
                        offset += 6;

                        if (match.body.dl_dst_mask == '00:00:00:00:00:00') {
                            delete match.body.dl_dst_mask;
                        }

                        if (match.body.dl_dst_mask == 'ff:ff:ff:ff:ff:ff') {
                            delete match.body.dl_dst;
                            delete match.body.dl_dst_mask;
                        }

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_DL_VLAN) == 0) {
                            match.body.dl_vlan = buffer.readUInt16BE(offset, true);
                        }
                        offset += 2;

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_DL_VLAN_PCP) == 0) {
                            match.body.dl_vlan_pcp = buffer.readUInt8(offset, true);
                        }
                        offset += 2; /* + pad */

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_DL_TYPE) == 0) {
                            match.body.dl_type = buffer.readUInt16BE(offset, true);
                        }
                        offset += 2;

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_NW_TOS) == 0) {
                            match.body.nw_tos = buffer.readUInt8(offset, true);
                        }
                        offset += 1;

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_NW_PROTO) == 0) {
                            match.body.nw_proto = buffer.readUInt8(offset, true);
                        }
                        offset += 1;

                        match.body.nw_src = packet.ipv4ToString(buffer, offset);
                        offset += 4;
                        match.body.nw_src_mask = packet.ipv4ToString(buffer, offset);
                        offset += 4;

                        if (match.body.nw_src_mask == '0.0.0.0') {
                            delete match.body.nw_src_mask;
                        }

                        if (match.body.nw_src_mask == '255.255.255.255') {
                            delete match.body.nw_src;
                            delete match.body.nw_src_mask;
                        }

                        match.body.nw_dst = packet.ipv4ToString(buffer, offset);
                        offset += 4;
                        match.body.nw_dst_mask = packet.ipv4ToString(buffer, offset);
                        offset += 4;

                        if (match.body.nw_dst_mask == '0.0.0.0') {
                            delete match.body.nw_dst_mask;
                        }

                        if (match.body.nw_dst_mask == '255.255.255.255') {
                            delete match.body.nw_dst;
                            delete match.body.nw_dst_mask;
                        }

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_TP_SRC) == 0) {
                            match.body.tp_src = buffer.readUInt16BE(offset, true);
                        }
                        offset += 2;

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_TP_DST) == 0) {
                            match.body.tp_dst = buffer.readUInt16BE(offset, true);
                        }
                        offset += 2;

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_MPLS_LABEL) == 0) {
                            match.body.mpls_label = buffer.readUInt32BE(offset, true);
                        }
                        offset += 4;

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_MPLS_TC) == 0) {
                            match.body.mpls_tc = buffer.readUInt8(offset, true);
                        }
                        offset += 4; /* + pad */

                        match.body.metadata = buffer.toString('hex', offset, offset + 8);
                        match.body.metadata_mask = buffer.toString('hex', offset + 8, offset + 16);
                        offset += 16;

                        if (match.body.metadata_mask == '0000000000000000') {
                            match.body.metadata_mask = undefined;
                        }

                        if (match.body.metadata_mask == 'ffffffffffffffff') {
                            match.body.metadata = undefined;
                            match.body.metadata_mask = undefined;
                        }

                        return {"match" : match, "offset" : offset};
                    }

                    default: {
                        return {
                            "error" : util.format('Received match has unknown type (%d).', type),
                            "ofp_error" : {"type" : 'OFPET_BAD_MATCH', "code" : 'OFPBMC_BAD_TYPE'}
                        }
                    }
                }
        }
}
