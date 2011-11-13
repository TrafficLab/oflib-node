/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

var util = require('util');

var Int64 = require('node-int64');

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

        message.version = buffer.readUInt8(offset, true);

        if (message.version != ofp.OFP_VERSION) {
            return {
                "error" : util.format('Received message has wrong version (%d).', message.version),
                "ofp_error" : {"type" : 'OFPET_HELLO_FAILED', "code" : 'OFPHFC_INCOMPATIBLE'}
            }
        }

        var type = buffer.readUInt8(offset + 1, true);
        var len  = buffer.readUInt16BE(offset + 2, true);
        message.header = {"xid" : buffer.readUInt32BE(offset + 4, true)};

        if (buffer.length < offset + len) {
            return {
                "error" : util.format('Received message is too short (%d).', (buffer.length - offset)),
                "ofp_error" : {"type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'}
            }
        }
        offset += 8;

        switch (type) {
            case ofp.ofp_type.OFPT_HELLO: {
            }

            case ofp.ofp_type.OFPT_ERROR: {
            }

            case ofp.ofp_type.OFPT_ECHO_REQUEST: {
            }

            case ofp.ofp_type.OFPT_ECHO_REPLY: {
            }

            case ofp.ofp_type.OFPT_EXPERIMENTER: {
            }

            case ofp.ofp_type.OFPT_FEATURES_REQUEST: {
            }

            case ofp.ofp_type.OFPT_FEATURES_REPLY: {
            }

            case ofp.ofp_type.OFPT_GET_CONFIG_REQUEST: {
            }

            case ofp.ofp_type.OFPT_GET_CONFIG_REPLY: {
            }

            case ofp.ofp_type.OFPT_SET_CONFIG: {
            }

            case ofp.ofp_type.OFPT_PACKET_IN: {
            }

            case ofp.ofp_type.OFPT_FLOW_REMOVED: {
            }

            case ofp.ofp_type.OFPT_PORT_STATUS: {
            }

            case ofp.ofp_type.OFPT_PACKET_OUT: {
            }

            case ofp.ofp_type.OFPT_FLOW_MOD: {
            }

            case ofp.ofp_type.OFPT_GROUP_MOD: {
            }

            case ofp.ofp_type.OFPT_PORT_MOD: {
            }

            case ofp.ofp_type.OFPT_TABLE_MOD: {
            }

            case ofp.ofp_type.OFPT_STATS_REQUEST: {
            }

            case ofp.ofp_type.OFPT_STATS_REPLY: {
            }

            case ofp.ofp_type.OFPT_BARRIER_REQUEST: {
            }

            case ofp.ofp_type.OFPT_BARRIER_REPLY: {
            }

            case ofp.ofp_type.OFPT_QUEUE_GET_CONFIG_REQUEST: {
            }

            case ofp.ofp_type.OFPT_QUEUE_GET_CONFIG_REPLY: {
            }

            default: {
                return {
                    "error" : util.format('Received unknown message.header.type (%d).', type),
                    "ofp_error" : {"type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBAC_BAD_TYPE'}
                }
            }
        }
}
