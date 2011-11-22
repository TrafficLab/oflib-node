/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('../ofp.js');
var ofputil = require('../../util.js');

var offsetsHeader = ofp.offsets.ofp_header;
var offsets = ofp.offsets.ofp_packet_in;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var message = {
                            "header" : {"type" : 'OFPT_PACKET_IN'},
                            "body" : {}
                        };
                    var warnings = [];

                    var len = buffer.readUInt16BE(offset + offsetsHeader.length, true);

                    if (len < ofp.sizes.ofp_packet_in) {
                        return {
                            "error" : {
                                "desc" : util.format('%s message at offset %d has invalid length (%d).', message.header.type, offset, len)
                            }
                        }
                    }

                    ofputil.setIfNotEq(message.body, 'buffer_id', buffer.readUInt32BE(offset + offsets.buffer_id, true), 0xffffffff);

                    message.body.total_len = buffer.readUInt16BE(offset + offsets.total_len, true);

                    var in_port = buffer.readUInt16BE(offset + offsets.in_port, true);
                    if (in_port > ofp.ofp_port.OFPP_MAX) {
                        if (in_port == ofp.ofp_port.OFPP_LOCAL) {
                            message.body.in_port = 'OFPP_LOCAL';
                        } else {
                            message.body.in_port = in_port;
                            warnings.push({"desc" : util.format('%s message at offset %d has invalid in_port (%d).', message.header.type, offset, in_port)});
                        }
                    } else {
                        message.body.in_port = in_port;
                    }

                    var reason = buffer.readUInt8(offset + offsets.reason, true);
                    if (!(ofputil.setEnum(message.body, 'reason', reason, ofp.ofp_packet_in_reason_rev))) {
                        message.body.reason = reason;
                        warnings.push({"desc" : util.format('%s message at offset %d has invalid reason (%d).', message.header.type, offset, reason)});
                    }

                    var dataLen = len - ofp.sizes.ofp_packet_in; // 2 for padding
                    if (dataLen > message.body.total_len) {
                        warnings.push({"desc" : util.format('%s message at offset %d has invalid total_len (%d).', message.header.type, offset, total_len)});
                    }

                    if (dataLen > 0) {
                        message.body.data = new Buffer(dataLen);
                        buffer.copy(message.body.data, 0, offset + offsets.data + 2, offset + offsets.data + dataLen + 2);
                    }

                    if (warnings.length == 0) {
                        return {
                            "message" : message,
                            "offset" : offset + len
                        }
                    } else {
                        return {
                            "message" : message,
                            "warnings" : warnings,
                            "offset" : offset + len
                        }
                    }
            }

}

})();
