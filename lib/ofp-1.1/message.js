/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */


(function() {

"use strict";

var util = require('util');
var ofp = require('./ofp.js');

var barrierReply = require('./messages/barrier-reply.js');
var barrierRequest = require('./messages/barrier-request.js');
var echoReply = require('./messages/echo-reply.js');
var echoRequest = require('./messages/echo-request.js');
var error = require('./messages/error.js');
var experimenter = require('./messages/experimenter.js');
var featuresReply = require('./messages/features-reply.js');
var featuresRequest = require('./messages/features-request.js');
var flowMod = require('./messages/flow-mod.js');
var flowRemoved = require('./messages/flow-removed.js');
var getConfigReply = require('./messages/get-config-reply.js');
var getConfigRequest = require('./messages/get-config-request.js');
var groupMod = require('./messages/group-mod.js');
var hello = require('./messages/hello.js');
var packetIn = require('./messages/packet-in.js');
var packetOut = require('./messages/packet-out.js');
var portMod = require('./messages/port-mod.js');
var portStatus = require('./messages/port-status.js');
var queueGetConfigReply = require('./messages/queue-get-config-reply.js');
var queueGetConfigRequest = require('./messages/queue-get-config-request.js');
var setConfig = require('./messages/set-config.js');
var statsReply = require('./messages/stats-reply.js');
var statsRequest = require('./messages/stats-request.js');
var tableMod = require('./messages/table-mod.js');

var unpack = {};
unpack[ofp.ofp_type.OFPT_HELLO] =                    hello.unpack;
unpack[ofp.ofp_type.OFPT_ERROR] =                    error.unpack;
unpack[ofp.ofp_type.OFPT_ECHO_REQUEST] =             echoRequest.unpack;
unpack[ofp.ofp_type.OFPT_ECHO_REPLY] =               echoReply.unpack;
unpack[ofp.ofp_type.OFPT_EXPERIMENTER] =             experimenter.unpack;
unpack[ofp.ofp_type.OFPT_FEATURES_REQUEST] =         featuresRequest.unpack;
unpack[ofp.ofp_type.OFPT_FEATURES_REPLY] =           featuresReply.unpack;
unpack[ofp.ofp_type.OFPT_GET_CONFIG_REQUEST] =       getConfigRequest.unpack;
unpack[ofp.ofp_type.OFPT_GET_CONFIG_REPLY] =         getConfigReply.unpack;
unpack[ofp.ofp_type.OFPT_SET_CONFIG] =               setConfig.unpack;
unpack[ofp.ofp_type.OFPT_PACKET_IN] =                packetIn.unpack;
unpack[ofp.ofp_type.OFPT_FLOW_REMOVED] =             flowRemoved.unpack;
unpack[ofp.ofp_type.OFPT_PORT_STATUS] =              portStatus.unpack;
unpack[ofp.ofp_type.OFPT_PACKET_OUT] =               packetOut.unpack;
unpack[ofp.ofp_type.OFPT_FLOW_MOD] =                 flowMod.unpack;
unpack[ofp.ofp_type.OFPT_GROUP_MOD] =                groupMod.unpack;
unpack[ofp.ofp_type.OFPT_PORT_MOD] =                 portMod.unpack;
unpack[ofp.ofp_type.OFPT_TABLE_MOD] =                tableMod.unpack;
unpack[ofp.ofp_type.OFPT_STATS_REQUEST] =            statsRequest.unpack;
unpack[ofp.ofp_type.OFPT_STATS_REPLY] =              statsReply.unpack;
unpack[ofp.ofp_type.OFPT_BARRIER_REQUEST] =          barrierRequest.unpack;
unpack[ofp.ofp_type.OFPT_BARRIER_REPLY] =            barrierReply.unpack;
unpack[ofp.ofp_type.OFPT_QUEUE_GET_CONFIG_REQUEST] = queueGetConfigRequest.unpack;
unpack[ofp.ofp_type.OFPT_QUEUE_GET_CONFIG_REPLY] =   queueGetConfigReply.unpack;

var pack = {
        OFPT_HELLO :                    hello.pack,
        OFPT_ERROR :                    error.pack,
        OFPT_ECHO_REQUEST :             echoRequest.pack,
        OFPT_ECHO_REPLY :               echoReply.pack,
        OFPT_EXPERIMENTER :             experimenter.pack,
        OFPT_FEATURES_REQUEST :         featuresRequest.pack,
        OFPT_FEATURES_REPLY :           featuresReply.pack,
        OFPT_GET_CONFIG_REQUEST :       getConfigRequest.pack,
        OFPT_GET_CONFIG_REPLY :         getConfigReply.pack,
        OFPT_SET_CONFIG :               setConfig.pack,
        OFPT_PACKET_IN :                packetIn.pack,
        OFPT_FLOW_REMOVED :             flowRemoved.pack,
        OFPT_PORT_STATUS :              portStatus.pack,
        OFPT_PACKET_OUT :               packetOut.pack,
        OFPT_FLOW_MOD :                 flowMod.pack,
        OFPT_GROUP_MOD :                groupMod.pack,
        OFPT_PORT_MOD :                 portMod.pack,
        OFPT_TABLE_MOD :                tableMod.pack,
        OFPT_STATS_REQUEST :            statsRequest.pack,
        OFPT_STATS_REPLY :              statsReply.pack,
        OFPT_BARRIER_REQUEST :          barrierRequest.pack,
        OFPT_BARRIER_REPLY :            barrierReply.pack,
        OFPT_QUEUE_GET_CONFIG_REQUEST : queueGetConfigRequest.pack,
        OFPT_QUEUE_GET_CONFIG_REPLY :   queueGetConfigReply.pack
};

var offsets = ofp.offsets.ofp_header;

module.exports = {
    struct : 'message',

    unpack : function(buffer, offset) {
                var version, len, type, unpacked;

                if (buffer.length < offset + ofp.sizes.ofp_header) {
                    return {
                        error : {
                            desc : util.format('message at offset %d is too short (%d).', offset, (buffer.length - offset)),
                            type : 'OFPET_BAD_REQUEST', code : 'OFPBRC_BAD_LEN'
                        }
                    };
                }

                version = buffer.readUInt8(offset + offsets.version, true);
                if (version !== ofp.OFP_VERSION) {
                    return {
                        error : {
                            desc : util.format('message at offset %d has wrong version (%d).', offset, version),
                            type : 'OFPET_BAD_REQUEST', code : 'OFPBRC_BAD_VERSION'
                        }
                    };
                }

                len  = buffer.readUInt16BE(offset + offsets.length, true);

                if (buffer.length < offset + len) {
                    return {
                        error : {
                            desc : util.format('message at offset %d is too short (%d).', offset, (buffer.length - offset)),
                            type : 'OFPET_BAD_REQUEST', code : 'OFPBRC_BAD_LEN'
                        }
                    };
                }

                type = buffer.readUInt8(offset + offsets.type, true);

                if (typeof unpack[type] !== 'undefined') {
                    unpacked = (unpack[type])(buffer, offset);
                } else {
                    return {
                        error : {
                            desc : util.format('message at offset %d has invalid type (%d).', offset, type),
                            type : 'OFPET_BAD_REQUEST', code : 'OFPBRC_BAD_TYPE'
                        }
                    };
                }

                if (typeof unpacked.error !== 'undefined') {
                    return unpacked;
                }

                unpacked.message.version = '1.1';
                unpacked.message.header.xid = buffer.readUInt32BE(offset + offsets.xid, true);
                return unpacked;
    },

    pack : function(message, buffer, offset) {
                var type, packed;

                if (buffer.length < offset + ofp.sizes.ofp_header) {
                    return {
                        error : { desc : util.format('message at offset %d does not fit the buffer.', offset)}
                    };
                }

                type = message.header.type;

                if (typeof pack[type] !== 'undefined') {
                    packed = (pack[type])(message, buffer, offset);
                } else {
                    return {
                        error : {
                            desc : util.format('unknown message at %d (%s).', offset, message.header.type)
                        }
                    };
                }

                if (typeof packed.error !== 'undefined') {
                    return packed;
                }

                buffer.writeUInt8(ofp.OFP_VERSION, offset + offsets.version, true);
                buffer.writeUInt16BE(packed.offset - offset, offset + offsets.length, true);
                buffer.writeUInt32BE(message.header.xid, offset + offsets.xid, true);
                return packed;
    }
};

}());
