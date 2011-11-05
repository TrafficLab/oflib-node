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
var unpackStruct      = require('./unpack_struct.js');

/*
 * Returns:
 * {"message" : <JSON>, "offset" : <offset after instruction> }
 * Error:
 * {"error" : "<error text>" [, "ofp_error" : {"type" : <type>, "code" : <code>}]}
 */
module.exports = function message_unpack(buffer, offset) {
        if (!offset) { offset = 0 };

        var message = {};

        if (buffer.length < offset + ofp.sizes.ofp_header) {
            return {
                "error" : util.format('Received message is too short (%d).', (buffer.length - offset)),
                "ofp_error" : {"type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'}
            }
        }

        var version = buffer.readUInt8(offset, true);

        if (version != ofp.OFP_VERSION) {
            return {
                "error" : util.format('Received message has wrong version (%d).', version),
                "ofp_error" : {"type" : 'OFPET_HELLO_FAILED', "code" : 'OFPHFC_INCOMPATIBLE'}
            }
        }

        var type = buffer.readUInt8(offset + 1, true);
        var len  = buffer.readUInt16BE(offset + 2, true);
        message.xid  = buffer.readUInt32BE(offset + 4, true);

        if (buffer.length < offset + len) {
            return {
                "error" : util.format('Received message is too short (%d).', (buffer.length - offset)),
                "ofp_error" : {"type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'}
            }
        }
        offset += 8;

        switch (type) {
            case ofp.ofp_type.OFPT_HELLO: {
                message.type = 'OFPT_HELLO';

                if (len != ofp.sizes.ofp_header) {
                    return {
                        "error" : util.format('Received %s message has invalid length (%d).', message.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'}
                    }
                }

                return {"message" : message, "offset" : offset};
            }

            case ofp.ofp_type.OFPT_ERROR: {
                message.type = 'OFPT_ERROR';

                if (len < ofp.sizes.ofp_error_msg) {
                    return {
                        "error" : util.format('Received %s message has invalid length (%d).', message.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'}
                    }
                }

               var errorType = buffer.readUInt16BE(offset, true);
               var errorCode = buffer.readUInt16BE(offset + 2, true);
               offset += 4;


                if (ofp.ofp_error_type_rev[errorType] == undefined) {
                    return {
                        "error" : util.format('Received %s message with unknown error_type (%d).', error_type)
                    }
                }

                message.error_type = ofp.ofp_error_type_rev[errorType];

                // hack
                var errorCodeMapName = message.error_type.toLowerCase().replace('ofpet_', 'ofp_') + "_code_rev";

                if (ofp[errorCodeMapName][errorCode] == undefined) {
                    return {
                        "error" : util.format('Received %s message with unknown error_type (%d).', error_type)
                    }
                }

                message.error_code = ofp[errorCodeMapName][errorCode];

                if (len > ofp.sizes.ofp_error_msg) {
                    message.data = buffer.toString('hex', offset, offset + len - ofp.sizes.ofp_header);
                    offset += len - ofp.sizes.ofp_error_msg;
                }

                return {"message" : message, "offset" : offset};
            }

            case ofp.ofp_type.OFPT_ECHO_REQUEST: {
                message.type = 'OFPT_ECHO_REQUEST';

                if (len < ofp.sizes.ofp_header) {
                    return {
                        "error" : util.format('Received %s message has invalid length (%d).', message.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'}
                    }
                }

                if (len > ofp.sizes.ofp_header) {
                    message.data = buffer.toString('hex', offset, offset + len - ofp.sizes.ofp_header);
                    offset += len - ofp.sizes.ofp_header;
                }

                return {"message" : message, "offset" : offset};
            }

            case ofp.ofp_type.OFPT_ECHO_REPLY: {
                message.type = 'OFPT_ECHO_REPLY';

                if (len < ofp.sizes.ofp_header) {
                    return {
                        "error" : util.format('Received %s message has invalid length (%d).', message.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'}
                    }
                }

                if (len > ofp.sizes.ofp_header) {
                    message.data = buffer.toString('hex', offset, offset + len - ofp.sizes.ofp_header);
                    offset += len - ofp.sizes.ofp_header;
                }

                return {"message" : message, "offset" : offset};
            }

            case ofp.ofp_type.OFPT_EXPERIMENTER: {
                /* TODO: experimenter callback */
                message.type = 'OFPT_EXPERIMENTER';

                if (len < ofp.sizes.ofp_experimenter_header) {
                    return {
                        "error" : util.format('Received %s message has invalid length (%d).', action.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'}
                    }
                }

                message.experimenter_id = buffer.readUInt32BE(offset, true);
                //offset += 4;
                offset += len - 4;

                return {"message" : message, "offset" : offset};
            }

            case ofp.ofp_type.OFPT_FEATURES_REQUEST: {
                message.type = 'OFPT_FEATURES_REQUEST';

                if (len != ofp.sizes.ofp_header) {
                    return {
                        "error" : util.format('Received %s message has invalid length (%d).', message.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'}
                    }
                }

                return {"message" : message, "offset" : offset};
            }

            case ofp.ofp_type.OFPT_FEATURES_REPLY: {
                message.type = 'OFPT_FEATURES_REPLY';

                message.datapath_id = buffer.toString('hex', offset, offset + 8);
                message.n_buffers = buffer.readUInt32BE(offset + 8, true);
                message.n_tables = buffer.readUInt8(offset + 12, true);
                offset += 16; /* + pad */

                var capabilities = buffer.readUInt32BE(offset, true);
                var capabilitiesParsed = ofputil.parseFlags(capabilities, ofp.ofp_capabilities);
                if (capabilitiesParsed.remain != 0) {
                    return {
                        "error" : util.format('Received %s message  has invalid capabilities (%d).', message.type,  capabilities)
                    }
                }
                message.capabilities = capabilitiesParsed.array;
                offset += 8; /* + reserved */

                message.ports = [];

                var portEnd = offset + len - ofp.sizes.ofp_switch_features;
                while (offset < portEnd) {
                    var unpack = unpackStruct.port(buffer, offset);
                    if ('error' in unpack) {
                        return unpack;
                    }
                    message.ports.push(unpack.port);
                    offset = unpack.offset;
                }

                if (offset != portEnd) {
                    return {
                        "error" : util.format('The %s received message contained extra bytes (%d).', message.type, (portEnd - offset))
                    }
                }

                return {"message" : message, "offset" : offset};
            }

            case ofp.ofp_type.OFPT_GET_CONFIG_REQUEST: {
                message.type = 'OFPT_GET_CONFIG_REQUEST';

                if (len != ofp.sizes.ofp_header) {
                    return {
                        "error" : util.format('Received %s message has invalid length (%d).', message.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'}
                    }
                }

                return {"message" : message, "offset" : offset};
            }

            case ofp.ofp_type.OFPT_GET_CONFIG_REPLY: {
                message.type = 'OFPT_GET_CONFIG_REPLY';

                if (len != ofp.sizes.ofp_switch_config) {
                    return {
                        "error" : util.format('Received %s message has invalid length (%d).', message.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'}
                    }
                }

                var flags = buffer.readUInt16BE(offset, true);
                message.flags = [];

                if (flags > ofp.ofp_config_flags.OFPC_FRAG_MASK &
                            ofp.ofp_config_flags.OFPC_INVALID_TTL_TO_CONTROLLER) {
                    return {
                        "error" : util.format('Received %s message has invalid length (%d).', message.type, len),
                        "ofp_error" : {"type" : 'OFPET_SWITCH_CONFIG_FAILED', "code" : 'OFPSCFC_BAD_FLAGS'}
                    }
                }

                switch (flags & ofp.ofp_config_flags.OFPC_FRAG_MASK) {
                    case ofp.ofp_config_flags.OFPC_FRAG_NORMAL : {
                        message.flags.push('OFPC_FRAG_NORMAL');
                        break;
                    }
                    case ofp.ofp_config_flags.OFPC_FRAG_DROP : {
                        message.flags.push('OFPC_FRAG_DROP');
                        break;
                    }
                    case ofp.ofp_config_flags.OFPC_FRAG_REASM : {
                        message.flags.push('OFPC_FRAG_REASM');
                        break;
                    }
                    default: {
                        return {
                            "error" : util.format('Received %s message has invalid length (%d).', message.type, len),
                            "ofp_error" : {"type" : 'OFPET_SWITCH_CONFIG_FAILED', "code" : 'OFPSCFC_BAD_FLAGS'}
                        }
                    }
                }

                if ((flags & ofp.ofp_config_flags.OFPC_INVALID_TTL_TO_CONTROLLER) != 0) {
                    message.flags.push('OFPC_INVALID_TTL_TO_CONTROLLER');
                }

                message.miss_send_len = buffer.readUInt16BE(offset + 2, true);
                offset += 4;

                return {"message" : message, "offset" : offset};
            }

            case ofp.ofp_type.OFPT_SET_CONFIG: {
                message.type = 'OFPT_SET_CONFIG';

                if (len != ofp.sizes.ofp_switch_config) {
                    return {
                        "error" : util.format('Received %s message has invalid length (%d).', message.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'}
                    }
                }

                var flags = buffer.readUInt16BE(offset, true);
                message.flags = [];

                if (flags > ofp.ofp_config_flags.OFPC_FRAG_MASK &
                            ofp.ofp_config_flags.OFPC_INVALID_TTL_TO_CONTROLLER) {
                    return {
                        "error" : util.format('Received %s message has invalid length (%d).', message.type, len),
                        "ofp_error" : {"type" : 'OFPET_SWITCH_CONFIG_FAILED', "code" : 'OFPSCFC_BAD_FLAGS'}
                    }
                }

                switch (flags & ofp.ofp_config_flags.OFPC_FRAG_MASK) {
                    case ofp.ofp_config_flags.OFPC_FRAG_NORMAL : {
                        message.flags.push('OFPC_FRAG_NORMAL');
                        break;
                    }
                    case ofp.ofp_config_flags.OFPC_FRAG_DROP : {
                        message.flags.push('OFPC_FRAG_DROP');
                        break;
                    }
                    case ofp.ofp_config_flags.OFPC_FRAG_REASM : {
                        message.flags.push('OFPC_FRAG_REASM');
                        break;
                    }
                    default: {
                        return {
                            "error" : util.format('Received %s message has invalid length (%d).', message.type, len),
                            "ofp_error" : {"type" : 'OFPET_SWITCH_CONFIG_FAILED', "code" : 'OFPSCFC_BAD_FLAGS'}
                        }
                    }
                }

                if ((flags & ofp.ofp_config_flags.OFPC_INVALID_TTL_TO_CONTROLLER) != 0) {
                    message.flags.push('OFPC_INVALID_TTL_TO_CONTROLLER');
                }

                message.miss_send_len = buffer.readUInt16BE(offset + 2, true);
                offset += 4;

                return {"message" : message, "offset" : offset};
            }

            case ofp.ofp_type.OFPT_PACKET_IN: {
                message.type = 'OFPT_PACKET_IN';

                if (len < ofp.sizes.ofp_packet_in) {
                    return {
                        "error" : util.format('Received %s message has invalid length (%d).', message.type, len)
                    }
                }

                ofputil.setIfNotEq(message, 'buffer_id', buffer.readUInt32BE(offset, true), 0xffffffff);
                offset += 4;

                message.in_port = buffer.readUInt32BE(offset, true);
                offset += 4;

                if (message.in_port == 0 || message.in_port > ofp.ofp_port_no.OFPP_MAX) {
                    return {
                            "error" : util.format('Received %s message has invalid port (%d).', message.type, message.in_port)
                        }
                }

                var in_phy_port = buffer.readUInt32BE(offset, true);

                if (in_phy_port == 0 || in_phy_port > ofp.ofp_port_no.OFPP_MAX) {
                    return {
                            "error" : util.format('Received %s message has invalid port (%d).', message.type, message.in_phy_port)
                        }
                }
                ofputil.setIfNotEq(message, 'in_phy_port', in_phy_port, message.in_port);
                offset += 4;

                message.total_len = buffer.readUInt16BE(offset, true);
                offset += 2;

                if (ofp.sizes.ofp_packet_in + 2 + message.total_len < len) {
                    return {
                            "error" : util.format('Received %s message has invalid total_len (%d).', message.type, message.total_len)
                        }
                }

                var reason = buffer.readUInt8(offset, true);
                offset += 1;

                if (ofp.ofp_packet_in_reason_rev[reason] == undefined) {
                    return {
                        "error" : util.format('Received %s message has invalid reason (%d).', message.type, reason)
                    }
                }
                message.reason = ofp.ofp_packet_in_reason_rev[reason];

                message.table_id = buffer.readUInt8(offset, true);
                if (message.table_id > ofp.ofp_table.OFPTT_MAX) {
                    return {
                        "error" : util.format('Received %s message has invalid table (%d).', message.type, message.table_id)
                    }
                }
                offset += 1;

                if (len > ofp.sizes.ofp_packet_in + 2) { // pad = 2
                    var dataLen = len - ofp.sizes.ofp_packet_in - 2;
                    message.data = buffer.toString('hex', offset + 2, offset + 2 + dataLen);
                }

                offset += (len - ofp.sizes.ofp_packet_in);

                return {"message" : message, "offset" : offset};
            }

            case ofp.ofp_type.OFPT_FLOW_REMOVED: {
                message.type = 'OFPT_FLOW_REMOVED';

                // NOTE: ofp_flow_removed contains a standard match
                if (len != ofp.sizes.ofp_flow_removed) {
                    return {
                        "error" : util.format('Received %s message has invalid length (%d).', message.type, len)
                    }
                }

                message.cookie = buffer.toString('hex', offset, offset + 8);
                message.priority = buffer.readUInt16BE(offset + 8, true);
                offset += 10;

                if (!ofputil.setEnum(message, 'reason', buffer.readUInt8(offset, true), ofp.ofp_flow_removed_reason_rev)) {
                    return {
                        "error" : util.format('Received %s message has invalid reason (%d).', message.type, buffer.readUInt8(offset, true))
                    }
                }
                offset += 1;

                // TODO sanity check
                message.table_id = buffer.readUInt8(offset);
                offset += 1;

                message.duration_sec = buffer.readUInt32BE(offset);
                message.duration_nsec = buffer.readUInt32BE(offset + 4);
                offset += 8;

                var idle_timeout = buffer.readUInt16BE(offset);
                if (idle_timeout != 0) {
                    message.idle_timeout = idle_timeout;
                }
                offset += 4; /* + pad */

                message.packet_count = {"high" : buffer.readUInt32BE(offset, true),
                                        "low" :  buffer.readUInt32BE(offset + 4, true)};
                offset += 8;

                message.byte_count = {"high" : buffer.readUInt32BE(offset, true),
                                      "low" :  buffer.readUInt32BE(offset + 4, true)};
                offset += 8;

                var unpack = unpackStruct.match(buffer, offset);
                if ('error' in unpack) {
                    return unpack;
                }
                message.match = unpack.match;
                offset = unpack.offset;

                return {"message" : message, "offset" : offset};
            }

            case ofp.ofp_type.OFPT_PORT_STATUS: {
                message.type = 'OFPT_PORT_STATUS';

                if (len < ofp.sizes.ofp_port_status) {
                    return {
                        "error" : util.format('Received %s message has invalid length (%d).', message.type, len)
                    }
                }

                var reason = buffer.readUInt8(offset);
                if (ofp.ofp_port_reason_rev[reason] == undefined) {
                    return {
                        "error" : util.format('Received %s message has invalid reason (%d).', message.type, reason)
                    }
                }
                message.reason = ofp.ofp_port_reason_rev[reason];
                offset += 8; /* + pad */

                var unpack = unpackStruct.port(buffer, offset);
                if ('error' in unpack) {
                    return unpack;
                }
                message.port = unpack.port;
                offset = unpack.offset;

                return {"message" : message, "offset" : offset};
            }

            case ofp.ofp_type.OFPT_PACKET_OUT: {
                message.type = 'OFPT_PACKET_OUT';

                if (len < ofp.sizes.ofp_packet_out) {
                    return {
                        "error" : util.format('Received %s message has invalid length (%d).', message.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'}
                    }
                }

                var buffer_id = buffer.readUInt32BE(offset, true);
                offset += 4;

                if (buffer_id != 0xffffffff) {
                    message.buffer_id = buffer_id;
                }


                message.in_port = buffer.readUInt32BE(offset, true);
                offset += 4;

                if (message.in_port == 0 || (message.in_port > ofp.ofp_port_no.OFPP_MAX && message.in_port != ofp.ofp_port_no.OFPP_CONTROLLER)) {
                    return {
                            "error" : util.format('Received %s message has invalid port (%d).', message.type, message.in_port),
                            "ofp_error" : {"type" : 'OFPBAC_BAD_ACTION', "code" : 'OFPBAC_BAD_ARGUMENT'}
                        }
                }

                if (message.in_port == ofp.ofp_port_no.OFPP_CONTROLLER) {
                    message.in_port = 'OFPP_CONTROLLER';
                }

                var actions_len = buffer.readUInt16BE(offset, true);
                offset += 8; /* + pad */

                message.actions = [];

                var actEnd = offset + actions_len;
                while (offset < actEnd) {
                    var unpack = unpackAction(buffer, offset);
                    if ('error' in unpack) {
                        return unpack;
                    }
                    message.actions.push(unpack.action);
                    offset = unpack.offset;
                }

                if (offset != actEnd) {
                    return {
                        "error" : util.format('The %s received instruction contained extra bytes (%d).', instruction.type, (actEnd - offset)),
                        "ofp_error" : {"type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'}
                    }
                }

                var dataLen = len - (ofp.sizes.ofp_packet_out + actions_len);
                if (dataLen > 0) {
                    if (message.buffer_id == undefined) {
                        message.data = buffer.toString('hex', offset, offset + dataLen);
                    }
                    offset += dataLen;
                }

                return {"message" : message, "offset" : offset};
            }

            case ofp.ofp_type.OFPT_FLOW_MOD: {
                message.type = 'OFPT_FLOW_MOD';

                if (len < ofp.sizes.ofp_flow_mod) {
                    return {
                        "error" : util.format('Received %s message has invalid length (%d).', message.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'}
                    }
                }

                message.cookie = buffer.toString('hex', offset, offset + 8);
                message.cookie_mask = buffer.toString('hex', offset + 8, offset + 16);
                offset += 16;

                // TODO sanity check?
                message.table_id = buffer.readUInt8(offset, true);
                if (message.table_id == ofp.ofp_table.OFPTT_ALL) {
                    message.table_id = 'OFPTT_ALL';
                }
                offset += 1;

                var command = buffer.readUInt8(offset, true);
                offset += 1;

                if (ofp.ofp_flow_mod_command_rev[command] == undefined) {
                    return {
                        "error" : util.format('Received %s message has invalid command (%d).', message.type, command),
                        "ofp_error" : {"type" : 'OFPET_FLOW_MOD_FAILED', "code" : 'OFPFMFC_BAD_COMMAND'}
                    }
                }

                message.command = ofp.ofp_flow_mod_command_rev[command];

                var idle_timeout = buffer.readUInt16BE(offset, true);
                if (idle_timeout != 0) {
                    message.idle_timeout = idle_timeout;
                }
                offset += 2;

                var hard_timeout = buffer.readUInt16BE(offset, true);
                if (hard_timeout != 0) {
                    message.hard_timeout = hard_timeout;
                }
                offset += 2;

                message.priority = buffer.readUInt16BE(offset, true);
                ofputil.setIfNotEq(message, 'buffer_id', buffer.readUInt32BE(offset + 2, true), 0xffffffff);
                ofputil.setIfNotEq(message, 'out_port', buffer.readUInt32BE(offset + 6, true), ofp.ofp_port_no.OFPP_ANY); // TODO sanity check?
                ofputil.setIfNotEq(message, 'out_group', buffer.readUInt32BE(offset + 10, true), ofp.ofp_group.OFPG_ANY); // TODO sanity check?
                offset += 14;

                var flags = buffer.readUInt16BE(offset, true);
                var flagsParsed = ofputil.parseFlags(flags, ofp.ofp_flow_mod_flags);
                if (flagsParsed.remain != 0) {
                    return {
                        "error" : util.format('Received %s message has invalid flags (%d).', message.type, flags),
                        "ofp_error" : {"type" : 'OFPET_FLOW_MOD_FAILED', "code" : 'OFPFMFC_UNSPECIFIED'}
                    }
                }
                message.flags = flagsParsed.array;
                offset += 4; /* + pad */

                var unpack = unpackStruct.match(buffer, offset);
                if ('error' in unpack) {
                    return unpack;
                }
                message.match = unpack.match;
                var matchLen = unpack.offset - offset;
                offset = unpack.offset;

                message.instructions = [];
                // NOTE: ofp_flow_mod does contain a standard match structure!
                var instEnd = offset + len - ofp.sizes.ofp_flow_mod;
                while (offset < instEnd) {
                    var unpack = unpackInstruction(buffer, offset);
                    if ('error' in unpack) {
                        return unpack;
                    }
                    message.instructions.push(unpack.instruction);
                    offset = unpack.offset;
                }

                if (offset != instEnd) {
                    return {
                        "error" : util.format('The %s received message contained extra bytes (%d).', message.type, (portEnd - offset)),
                        "ofp_error" : {"type" : 'OFPET_FLOW_MOD_FAILED', "code" : 'OFPFMFC_UNSPECIFIED'}
                    }
                }

                return {"message" : message, "offset" : offset};
            }

            case ofp.ofp_type.OFPT_GROUP_MOD: {
                // TODO: experimenter
                message.type = 'OFPT_GROUP_MOD';

                if (len < ofp.sizes.ofp_group_mod) {
                    return {
                        "error" : util.format('Received %s message has invalid length (%d).', message.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'}
                    }
                }

                if (!ofputil.setEnum(message, 'command', buffer.readUInt16BE(offset, true), ofp.ofp_group_mod_command_rev)) {
                    return {
                        "error" : util.format('Received %s message has invalid command (%d).', message.type, buffer.readUInt16BE(offset, true)),
                        "ofp_error" : {"type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'}
                    }
                }
                offset += 2;

                if (!ofputil.setEnum(message, 'group_type', buffer.readUInt8(offset, true), ofp.ofp_group_type_rev)) {
                    return {
                        "error" : util.format('Received %s message has invalid type (%d).', message.type, buffer.readUInt8(offset, true)),
                        "ofp_error" : {"type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'}
                    }
                }
                offset += 2; /* + pad */

                //TODO sanity check command vs type
                message.group_id = buffer.readUInt32BE(offset, true);

                if (message.group_id > ofp.ofp_group.OFPG_MAX && message.group_id != ofp.ofp_group.OFPG_ALL) {
                    return {
                        "error" : util.format('Received %s message has invalid group (%d).', message.type, message.group_id),
                        "ofp_error" : {"type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'}
                    }
                }

                if (message.group_id == ofp.ofp_group.OFPG_ALL) {
                    message.group_id = 'OFPG_ALL';
                }
                offset += 4;

                // TODO sanity check buckets num vs type
                message.buckets = [];
                var bucketEnd = offset + len - ofp.sizes.ofp_group_mod;
                while (offset < bucketEnd) {
                    var unpack = unpackStruct.bucket(buffer, offset);
                    if ('error' in unpack) {
                        return unpack;
                    }
                    message.buckets.push(unpack.bucket);
                    offset = unpack.offset;
                }

                if (offset != bucketEnd) {
                    return {
                        "error" : util.format('The %s received message contained extra bytes (%d).', message.type, (bucketEnd - offset)),
                        "ofp_error" : {"type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'}
                    }
                }

                return {"message" : message, "offset" : offset};
            }

            case ofp.ofp_type.OFPT_PORT_MOD: {
                message.type = 'OFPT_PORT_MOD';

                if (len != ofp.sizes.ofp_port_mod) {
                    return {
                        "error" : util.format('Received %s message has invalid length (%d).', message.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'}
                    }
                }

                message.port_no = buffer.readUInt32BE(offset, true);
                if (message.port_no > ofp.ofp_port_no.OFPP_MAX) {
                    return {
                        "error" : util.format('Received %s message has invalid group (%d).', message.type, message.port_no),
                        "ofp_error" : {"type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'}
                    }
                }
                offset += 8; /* + pad */

                message.hw_addr = packet.ethToString(buffer, offset);
                offset += 8;

                var config = buffer.readUInt32BE(offset, true);
                var mask = buffer.readUInt32BE(offset + 4, true);

                var configSetParsed = ofputil.parseFlags((config & mask), ofp.ofp_port_config);
                if (configSetParsed.remain != 0) {
                    return {
                        "error" : util.format('Received port has invalid config (%d).', config),
                        "ofp_error" : {"type" : 'OFPET_PORT_MOD_FAILED', "code" : 'OFPPMFC_BAD_CONFIG'}
                    }
                }
                message.config_set = configSetParsed.array;

                var configUnsetParsed = ofputil.parseFlags((~config & mask), ofp.ofp_port_config);
                if (configUnsetParsed.remain != 0) {
                    return {
                        "error" : util.format('Received port has invalid config (%d).', config),
                        "ofp_error" : {"type" : 'OFPET_PORT_MOD_FAILED', "code" : 'OFPPMFC_BAD_CONFIG'}
                    }
                }
                message.config_unset = configUnsetParsed.array;
                offset += 8;

                var advertise = buffer.readUInt32BE(offset, true);
                if (advertise != 0) {
                    var advertiseParsed = ofputil.parseFlags(advertise, ofp.ofp_port_features);
                    if (advertiseParsed.remain != 0) {
                        return {
                            "error" : util.format('Received port has invalid advertise (%d).', advertise),
                            "ofp_error" : {"type" : 'OFPET_PORT_MOD_FAILED', "code" : 'OFPPMFC_BAD_ADVERTISE'}
                        }
                    }
                }
                message.advertise = advertiseParsed.array;
                offset += 8; /* + pad */

                return {"message" : message, "offset" : offset};
            }

            case ofp.ofp_type.OFPT_TABLE_MOD: {
                message.type = 'OFPT_TABLE_MOD';

                if (len != ofp.sizes.ofp_table_mod) {
                    return {
                        "error" : util.format('Received %s message has invalid length (%d).', message.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'}
                    }
                }

                message.table_id = buffer.readUInt8(offset, true);
                if (message.table_id == ofp.ofp_table.OFPTT_ALL) {
                    message.table_id = 'OFPTT_ALL';
                }
                offset += 4; /* + pad */

                var config = buffer.readUInt32BE(offset, true);
                switch (config) {
                    case ofp.ofp_table_config.OFPTC_TABLE_MISS_CONTROLLER: {
                        message.config = 'OFPTC_TABLE_MISS_CONTROLLER';
                        break;
                    }
                    case ofp.ofp_table_config.OFPTC_TABLE_MISS_CONTINUE: {
                        message.config = 'OFPTC_TABLE_MISS_CONTINUE';
                        break;
                    }
                    case ofp.ofp_table_config.OFPTC_TABLE_MISS_DROP: {
                        message.config = 'OFPTC_TABLE_MISS_DROP';
                        break;
                    }
                    default: {
                        return {
                            "error" : util.format('Received table_mod has invalid config (%d).', config),
                            "ofp_error" : {"type" : 'OFPET_TABLE_MOD_FAILED', "code" : 'OFPTMFC_BAD_CONFIG'}
                        }
                    }
                }
                offset += 4;

                return {"message" : message, "offset" : offset};
            }

            case ofp.ofp_type.OFPT_STATS_REQUEST: {
                message.type = 'OFPT_STATS_REQUEST';

                /* TODO: Implement */
                offset += len - ofp.sizes.ofp_header;

                return {"message" : message, "offset" : offset};
            }

            case ofp.ofp_type.OFPT_STATS_REPLY: {
                message.type = 'OFPT_STATS_REPLY';

                /* TODO: Implement */
                offset += len - ofp.sizes.ofp_header;

                return {"message" : message, "offset" : offset};
            }

            case ofp.ofp_type.OFPT_BARRIER_REQUEST: {
                message.type = 'OFPT_BARRIER_REQUEST';

                if (len != ofp.sizes.ofp_header) {
                    return {
                        "error" : util.format('Received %s message has invalid length (%d).', message.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'}
                    }
                }

                return {"message" : message, "offset" : offset};
            }

            case ofp.ofp_type.OFPT_BARRIER_REPLY: {
                message.type = 'OFPT_BARRIER_REPLY';

                if (len != ofp.sizes.ofp_header) {
                    return {
                        "error" : util.format('Received %s message has invalid length (%d).', message.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'}
                    }
                }

                return {"message" : message, "offset" : offset};
            }

            case ofp.ofp_type.OFPT_QUEUE_GET_CONFIG_REQUEST: {
                message.type = 'OFPT_QUEUE_GET_CONFIG_REQUEST';

                /* TODO: Implement */
                offset += len - ofp.sizes.ofp_header;

                return {"message" : message, "offset" : offset};
            }

            case ofp.ofp_type.OFPT_QUEUE_GET_CONFIG_REPLY: {
                message.type = 'OFPT_QUEUE_GET_CONFIG_REPLY';

                /* TODO: Implement */
                offset += len - ofp.sizes.ofp_header;

                return {"message" : message, "offset" : offset};
            }

            default: {
                return {
                    "error" : util.format('Received unknown message type (%d).', type),
                    "ofp_error" : {"type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBAC_BAD_TYPE'}
                }
            }
        }
}
