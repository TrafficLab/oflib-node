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
 * {"struct" : <JSON>, "offset" : <offset after instruction> }
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
                struct = {};

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

                /* TODO: Implement */
                offset += len;

                return {"struct" : struct, "offset" : offset};
            }
}
