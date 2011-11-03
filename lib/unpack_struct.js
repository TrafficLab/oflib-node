/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

var util = require('util');
var ofp = require('./ofp.js');
var packet = require('./packet.js');

var unpackAction      = require('./unpack_action.js');
var unpackInstruction = require('./unpack_instruction.js');

/*
 * Returns:
 * {"<struct>" : <JSON>, "offset" : <offset after instruction> }
 * Error:
 * {"error" : "<error text>" [, "ofp_error_type" : <ofp error type>, "ofp_error_code" : <ofp error code>]}
 */
module.exports = {
        "bucket" : function bucket_unpack(buffer, offset) {
                struct = {};

                if (buffer.length < offset + ofp.sizes.ofp_bucket) {
                    return {
                        "error" : util.format('Received bucket is too short (%d).', (buffer.length - offset)),
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
                    }
                }

                var len  = buffer.readUInt16BE(offset, true);

                if (buffer.length < offset + len) {
                    return {
                        "error" : util.format('Received bucket is too short (%d).', (buffer.length - offset)),
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
                    }
                }

                /* TODO: Implement */
                offset += len;

                return {"struct" : struct, "offset" : offset};
            },

        "flowStats" : function flowStats_unpack(buffer, offset) {
                struct = {};

                if (buffer.length < offset + ofp.sizes.ofp_flow_stats) {
                    return {
                        "error" : util.format('Received flow_stats is too short (%d).', (buffer.length - offset)),
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
                    }
                }

                var len  = buffer.readUInt16BE(offset, true);

                if (buffer.length < offset + len) {
                    return {
                        "error" : util.format('Received flow_stats is too short (%d).', (buffer.length - offset)),
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
                    }
                }

                /* TODO: Implement */
                offset += len;

                return {"struct" : struct, "offset" : offset};
            },

        "groupStats" : function groupStats_unpack(buffer, offset) {
                struct = {};

                if (buffer.length < offset + ofp.sizes.ofp_group_stats) {
                    return {
                        "error" : util.format('Received group_stats is too short (%d).', (buffer.length - offset)),
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
                    }
                }

                var len  = buffer.readUInt16BE(offset, true);

                if (buffer.length < offset + len) {
                    return {
                        "error" : util.format('Received group_stats is too short (%d).', (buffer.length - offset)),
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
                    }
                }

                /* TODO: Implement */
                offset += len;

                return {"struct" : struct, "offset" : offset};
            },

        "queueProp" : function queueProp_unpack(buffer, offset) {
                struct = {};

                if (buffer.length < offset + ofp.sizes.ofp_queue_prop_header) {
                    return {
                        "error" : util.format('Received queue_prop is too short (%d).', (buffer.length - offset)),
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
                    }
                }

                var len  = buffer.readUInt16BE(offset, true);

                if (buffer.length < offset + len) {
                    return {
                        "error" : util.format('Received queue_prop is too short (%d).', (buffer.length - offset)),
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
                    }
                }

                /* TODO: Implement */
                offset += len;

                return {"struct" : struct, "offset" : offset};
            },

        "packetQueue" : function packetQueue_unpack(buffer, offset) {
                struct = {};

                if (buffer.length < offset + ofp.sizes.ofp_packet_queue) {
                    return {
                        "error" : util.format('Received packet_queue is too short (%d).', (buffer.length - offset)),
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
                    }
                }

                struct.queue_id = buffer.readUInt32BE(offset, true);
                var len  = buffer.readUInt16BE(offset + 4, true);

                if (buffer.length < offset + len) {
                    return {
                        "error" : util.format('Received packet_queue is too short (%d).', (buffer.length - offset)),
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
                    }
                }

                /* TODO: Implement */
                offset += len;

                return {"struct" : struct, "offset" : offset};
            },

        "port" : function port_unpack(buffer, offset) {
                struct = {};

                if (buffer.length < offset + ofp.sizes.ofp_port) {
                    return {
                        "error" : util.format('Received port is too short (%d).', (buffer.length - offset)),
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
                    }
                }

                /* TODO: Implement */
                offset += ofp.sizes.ofp_port;

                return {"struct" : struct, "offset" : offset};
            },

        "tableStats" : function tableStats_unpack(buffer, offset) {
                struct = {};

                if (buffer.length < offset + ofp.sizes.ofp_table_stats) {
                    return {
                        "error" : util.format('Received table_stats is too short (%d).', (buffer.length - offset)),
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
                    }
                }

                /* TODO: Implement */
                offset += ofp.sizes.ofp_table_stats;

                return {"struct" : struct, "offset" : offset};
            },

        "portStats" : function portStats_unpack(buffer, offset) {
                struct = {};

                if (buffer.length < offset + ofp.sizes.ofp_port_stats) {
                    return {
                        "error" : util.format('Received port_stats is too short (%d).', (buffer.length - offset)),
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
                    }
                }

                /* TODO: Implement */
                offset += ofp.sizes.ofp_port_stats;

                return {"struct" : struct, "offset" : offset};
            },

        "queueStats" : function queueStats_unpack(buffer, offset) {
                struct = {};

                if (buffer.length < offset + ofp.sizes.ofp_queue_stats) {
                    return {
                        "error" : util.format('Received queue_stats is too short (%d).', (buffer.length - offset)),
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
                    }
                }

                /* TODO: Implement */
                offset += ofp.sizes.ofp_queue_stats;

                return {"struct" : struct, "offset" : offset};
            },

        "groupDescStats" : function groupDescStats(buffer, offset) {
                struct = {};

                if (buffer.length < offset + ofp.sizes.ofp_group_desc_stats) {
                    return {
                        "error" : util.format('Received group_desc_stats is too short (%d).', (buffer.length - offset)),
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
                    }
                }

                var len  = buffer.readUInt16BE(offset, true);

                if (buffer.length < offset + len) {
                    return {
                        "error" : util.format('Received group_desc_stats is too short (%d).', (buffer.length - offset)),
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
                    }
                }

                /* TODO: Implement */
                offset += len;

                return {"struct" : struct, "offset" : offset};
            },

        "bucketCounter" : function bucketCounter(buffer, offset) {
                struct = {};

                if (buffer.length < offset + ofp.sizes.ofp_bucket_counter) {
                    return {
                        "error" : util.format('Received bucket_counter is too short (%d).', (buffer.length - offset)),
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
                    }
                }

                /* TODO: Implement */
                offset += ofp.sizes.ofp_bucket_counter;

                return {"struct" : struct, "offset" : offset};
            },

        "match" : function match_unpack(buffer, offset) {
                var match = {};

                if (buffer.length < offset + ofp.sizes.match) {
                    return {
                        "error" : util.format('Received match is too short (%d).', (buffer.length - offset)),
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
                    }
                }

                var type = buffer.readUInt16BE(offset, true);
                var len  = buffer.readUInt16BE(offset + 2, true);

                if (buffer.length < offset + len) {
                    return {
                        "error" : util.format('Received packet_queue is too short (%d).', (buffer.length - offset)),
                        "ofp_error_type" : 'OFPET_BAD_MATCH',
                        "ofp_error_code" : 'OFPBMC_BAD_LEN'
                    }
                }
                offset += 4;

                switch (type) {
                    /* TODO: Implement experimenter callbacks */
                    case ofp.ofp_match_type.OFPMT_STANDARD: {
                        // TODO: some validation missing?
                        match.type = 'OFMPT_STANDARD';

                        if (len != ofp.sizes.ofp_match_standard) {
                            return {
                                "error" : util.format('Received packet_queue is too short (%d).', (buffer.length - offset)),
                                "ofp_error_type" : 'OFPET_BAD_MATCH',
                                "ofp_error_code" : 'OFPBMC_BAD_LEN'
                            }
                        }

                        var wildcards = buffer.readUInt32BE(offset + 4, true); // skipping in_port
                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_IN_PORT) == 0) {
                            match.in_port = buffer.readUInt32BE(offset, true);
                        }
                        offset += 8; // including wildcards

                        match.dl_src = packet.ethToString(buffer, offset);
                        offset += 6;
                        match.dl_src_mask = packet.ethToString(buffer, offset);
                        offset += 6;
                        match.dl_dst = packet.ethToString(buffer, offset);
                        offset += 6;
                        match.dl_dst_mask = packet.ethToString(buffer, offset);
                        offset += 6;

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_DL_VLAN) == 0) {
                            match.dl_vlan = buffer.readUInt16BE(offset, true);
                        }
                        offset += 2;

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_DL_VLAN_PCP) == 0) {
                            match.dl_vlan_pcp = buffer.readUInt8(offset, true);
                        }
                        offset += 2; /* + pad */

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_DL_TYPE) == 0) {
                            match.dl_type = buffer.readUInt16BE(offset, true);
                        }
                        offset += 2;

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_NW_TOS) == 0) {
                            match.nw_tos = buffer.readUInt8(offset, true);
                        }
                        offset += 1;

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_NW_PROTO) == 0) {
                            match.nw_proto = buffer.readUInt8(offset, true);
                        }
                        offset += 1;

                        match.nw_src = packet.ipv4ToString(buffer, offset);
                        offset += 4;
                        match.nw_src_mask = packet.ipv4ToString(buffer, offset);
                        offset += 4;
                        match.nw_dst = packet.ipv4ToString(buffer, offset);
                        offset += 4;
                        match.nw_dst_mask = packet.ipv4ToString(buffer, offset);
                        offset += 4;

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_TP_SRC) == 0) {
                            match.tp_src = buffer.readUInt16BE(offset, true);
                        }
                        offset += 2;

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_TP_DST) == 0) {
                            match.tp_dst = buffer.readUInt16BE(offset, true);
                        }
                        offset += 2;

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_MPLS_LABEL) == 0) {
                            match.mpls_label = buffer.readUInt32BE(offset, true);
                        }
                        offset += 4;

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_MPLS_TC) == 0) {
                            match.mpls_tc = buffer.readUInt8(offset, true);
                        }
                        offset += 4; /* + pad */

                        match.metadata = buffer.toString('hex', offset, offset + 8);
                        match.metadata_mask = buffer.toString('hex', offset + 8, offset + 16);
                        offset += 16;

                        return {"match" : match, "offset" : offset};
                    }

                    default: {
                        return {
                            "error" : util.format('Received packet_queue is too short (%d).', (buffer.length - offset)),
                            "ofp_error_type" : 'OFPET_BAD_MATCH',
                            "ofp_error_code" : 'OFPBMC_BAD_TYPE'
                        }
                    }
                }
        }
}
