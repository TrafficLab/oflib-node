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
 * {"message" : <JSON>, "offset" : <offset after instruction> }
 * Error:
 * {"error" : "<error text>" [, "ofp_error_type" : <ofp error type>, "ofp_error_code" : <ofp error code>]}
 */
module.exports = function message_unpack(buffer, offset) {
        var message = {};

        if (buffer.length < offset + ofp.sizes.ofp_header) {
            return {
                "error" : util.format('Received message is too short (%d).', buffer.length),
                "ofp_error_type" : 'OFPET_BAD_REQUEST',
                "ofp_error_code" : 'OFPBRC_BAD_LEN'
            }
        }

        var version = buffer.readUInt8(offset, true);

        if (version != ofp.OFP_VERSION) {
            return {
                "error" : util.format('Received message has wrong version (%d).', version),
                "ofp_error_type" : 'OFPET_HELLO_FAILED',
                "ofp_error_code" : 'OFPHFC_INCOMPATIBLE'
            }
        }

        var type = buffer.readUInt8(offset + 1, true);
        var len  = buffer.readUInt16BE(offset + 2, true);
        message.xid  = buffer.readUInt32BE(offset + 4, true);

        if (buffer.length < offset + len) {
            return {
                "error" : util.format('Received message is too short (%d).', buffer.length),
                "ofp_error_type" : 'OFPET_BAD_REQUEST',
                "ofp_error_code" : 'OFPBRC_BAD_LEN'
            }
        }
        offset += 8;

        switch (type) {
            case ofp.ofp_type.OFPT_HELLO: {
                message.type = 'OFPT_HELLO';

                if (len != ofp.sizes.ofp_header) {
                    return {
                        "error" : util.format('Received %s message has invalid length (%d).', message.type, len),
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
                    }
                }

                return {"message" : message, "offset" : offset};
            }

            case ofp.ofp_type.OFPT_ERROR: {
                message.type = 'OFPT_ERROR';

                /* TODO: Implement */
                offset += len - ofp.sizes.ofp_header;

                return {"message" : message, "offset" : offset};
            }

            case ofp.ofp_type.OFPT_ECHO_REQUEST: {
                message.type = 'OFPT_ECHO_REQUEST';

                if (len < ofp.sizes.ofp_header) {
                    return {
                        "error" : util.format('Received %s message has invalid length (%d).', message.type, len),
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
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
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
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
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
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
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
                    }
                }

                return {"message" : message, "offset" : offset};
            }

            case ofp.ofp_type.OFPT_FEATURES_REPLY: {
                message.type = 'OFPT_FEATURES_REPLY';

                /* TODO: Implement */
                offset += len - ofp.sizes.ofp_header;

                return {"message" : message, "offset" : offset};
            }

            case ofp.ofp_type.OFPT_GET_CONFIG_REQUEST: {
                message.type = 'OFPT_GET_CONFIG_REQUEST';

                if (len != ofp.sizes.ofp_header) {
                    return {
                        "error" : util.format('Received %s message has invalid length (%d).', message.type, len),
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
                    }
                }

                return {"message" : message, "offset" : offset};
            }

            case ofp.ofp_type.OFPT_GET_CONFIG_REPLY: {
                message.type = 'OFPT_GET_CONFIG_REPLY';

                /* TODO: Implement */
                offset += len - ofp.sizes.ofp_header;

                return {"message" : message, "offset" : offset};
            }

            case ofp.ofp_type.OFPT_SET_CONFIG: {
                message.type = 'OFPT_SET_CONFIG';

                /* TODO: Implement */
                offset += len - ofp.sizes.ofp_header;

                return {"message" : message, "offset" : offset};
            }

            case ofp.ofp_type.OFPT_PACKET_IN: {
                message.type = 'OFPT_PACKET_IN';

                /* TODO: Implement */
                offset += len - ofp.sizes.ofp_header;

                return {"message" : message, "offset" : offset};
            }

            case ofp.ofp_type.OFPT_FLOW_REMOVED: {
                message.type = 'OFPT_FLOW_REMOVED';

                /* TODO: Implement */
                offset += len - ofp.sizes.ofp_header;

                return {"message" : message, "offset" : offset};
            }

            case ofp.ofp_type.OFPT_PORT_STATUS: {
                message.type = 'OFPT_PORT_STATUS';

                /* TODO: Implement */
                offset += len - ofp.sizes.ofp_header;

                return {"message" : message, "offset" : offset};
            }

            case ofp.ofp_type.OFPT_PACKET_OUT: {
                message.type = 'OFPT_PACKET_OUT';

                /* TODO: Implement */
                offset += len - ofp.sizes.ofp_header;

                return {"message" : message, "offset" : offset};
            }

            case ofp.ofp_type.OFPT_FLOW_MOD: {
                message.type = 'OFPT_FLOW_MOD';

                /* TODO: Implement */
                offset += len - ofp.sizes.ofp_header;

                return {"message" : message, "offset" : offset};
            }

            case ofp.ofp_type.OFPT_GROUP_MOD: {
                message.type = 'OFPT_GROUP_MOD';

                /* TODO: Implement */
                offset += len - ofp.sizes.ofp_header;

                return {"message" : message, "offset" : offset};
            }

            case ofp.ofp_type.OFPT_PORT_MOD: {
                message.type = 'OFPT_PORT_MOD';

                /* TODO: Implement */
                offset += len - ofp.sizes.ofp_header;

                return {"message" : message, "offset" : offset};
            }

            case ofp.ofp_type.OFPT_TABLE_MOD: {
                message.type = 'OFPT_TABLE_MOD';

                /* TODO: Implement */
                offset += len - ofp.sizes.ofp_header;

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
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
                    }
                }

                return {"message" : message, "offset" : offset};
            }

            case ofp.ofp_type.OFPT_BARRIER_REPLY: {
                message.type = 'OFPT_BARRIER_REPLY';

                if (len != ofp.sizes.ofp_header) {
                    return {
                        "error" : util.format('Received %s message has invalid length (%d).', message.type, len),
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
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
                    "ofp_error_type" : 'OFPET_BAD_REQUEST',
                    "ofp_error_code" : 'OFPBAC_BAD_TYPE'
                }
            }
        }
}
