/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('./ofp.js');


var barrierReply = require('./messages/barrier-reply.js');
var barrierRequest = require('./messages/barrier-request.js');
var echoReply = require('./messages/echo-reply.js');
var echoRequest = require('./messages/echo-request.js');
var error = require('./messages/error.js');
var featuresReply = require('./messages/features-reply.js');
var featuresRequest = require('./messages/features-request.js');
var flowMod = require('./messages/flow-mod.js');
var flowRemoved = require('./messages/flow-removed.js');
var getConfigReply = require('./messages/get-config-reply.js');
var getConfigRequest = require('./messages/get-config-request.js');
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
var vendor = require('./messages/vendor.js');


var offsets = ofp.offsets.ofp_header;

module.exports = {
            "unpack" : function(buffer, offset) {

                            if (buffer.length < offset + ofp.sizes.ofp_header) {
                                return {
                                    "error" : {
                                        "desc" : util.format('message at offset %d is too short (%d).', offset, (buffer.length - offset)),
                                        "type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'
                                    }
                                }
                            }

                            var version = buffer.readUInt8(offset + offsets.version, true);
                            if (version != ofp.OFP_VERSION) {
                                return {
                                    "error" : {
                                        "desc" : util.format('message at offset %d has wrong version (%d).', offset, version),
                                        "type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_VERSION'
                                    }
                                }
                            }

                            var len  = buffer.readUInt16BE(offset + offsets.length, true);

                            if (buffer.length < offset + len) {
                                return {
                                    "error" : {
                                        "desc" : util.format('message at offset %d is too short (%d).', offset, (buffer.length - offset)),
                                        "type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'
                                    }
                                }
                            }

                            var type = buffer.readUInt8(offset + offsets.type, true);

                            switch (type) {
                                case ofp.ofp_type.OFPT_HELLO: { var unpack = hello.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_ERROR: { var unpack = error.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_ECHO_REQUEST: { var unpack = echoRequest.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_ECHO_REPLY: { var unpack = echoReply.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_VENDOR: { var unpack = vendor.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_FEATURES_REQUEST: { var unpack = featuresRequest.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_FEATURES_REPLY: { var unpack = featuresReply.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_GET_CONFIG_REQUEST: { var unpack = getConfigRequest.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_GET_CONFIG_REPLY: { var unpack = getConfigReply.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_SET_CONFIG: { var unpack = setConfig.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_PACKET_IN: { var unpack = packetIn.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_FLOW_REMOVED: { var unpack = flowRemoved.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_PORT_STATUS: { var unpack = portStatus.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_PACKET_OUT: { var unpack = packetOut.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_FLOW_MOD: { var unpack = flowMod.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_PORT_MOD: { var unpack = portMod.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_STATS_REQUEST: { var unpack = statsRequest.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_STATS_REPLY: { var unpack = statsReply.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_BARRIER_REQUEST: { var unpack = barrierRequest.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_BARRIER_REPLY: { var unpack = barrierReply.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_QUEUE_GET_CONFIG_REQUEST: { var unpack = queueGetConfigRequest.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_QUEUE_GET_CONFIG_REPLY: { var unpack = queueGetConfigReply.unpack(buffer, offset); break; }
                                default: {
                                    return {
                                        "error" : {
                                            "desc" : util.format('message at offset %d has invalid type (%d).', offset, type),
                                            "type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_TYPE'
                                        }
                                    }
                                }
                            }

                            if ('error' in unpack) {
                                return unpack;
                            }

                            unpack.message.version = "1.0";
                            unpack.message.header.xid = buffer.readUInt32BE(offset + offsets.xid, true);
                            return unpack;
                    }

}

})();
