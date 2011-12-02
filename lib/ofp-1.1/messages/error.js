/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');

var ofp = require('../ofp.js');
var ofputil = require('../../util.js');

var offsetsHeader = ofp.offsets.ofp_header;
var offsets = ofp.offsets.ofp_error_msg;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var message = {
                            "header" : {"type" : 'OFPT_ERROR'},
                            "body" : {}
                        };
                    var warnings = [];

                    var len = buffer.readUInt16BE(offset + offsetsHeader.length, true);

                    if (len < ofp.sizes.ofp_error_msg) {
                        return {
                            "error" : {
                                "desc" : util.format('%s message at offset %d has invalid length (%d).', message.header.type, offset, len)
                            }
                        }
                    }

                    var type = buffer.readUInt16BE(offset + offsets.type, true);
                    var code = buffer.readUInt16BE(offset + offsets.code, true);

                    if (ofputil.setEnum(message.body, 'type', type, ofp.ofp_error_type_rev)) {
                        // NOTE: hackish
                        var errorCodeMapName = message.body.type.toLowerCase().replace('ofpet_', 'ofp_') + '_code_rev';
                        if (!(ofputil.setEnum(message.body, 'code', code, ofp[errorCodeMapName]))) {
                            message.body.code = code;
                            warnings.push({"desc" : util.format("%s message at offset %d has invalid code (%d).", message.header.type, offset, code)})
                        }
                    } else {
                        message.body.type = type;
                        message.body.code = code;
                        warnings.push({"desc" : util.format("%s message at offset %d has invalid type (%d).", message.header.type, offset, type)})
                    }

                    var dataLen = len - ofp.sizes.ofp_error_msg;
                    if (dataLen > 0) {
                        message.body.data = new Buffer(dataLen);
                        buffer.copy(message.body.data, 0, offset + ofp.sizes.ofp_error_msg, offset + ofp.sizes.ofp_error_msg + dataLen);
                    }

                    return {
                        "message" : message,
                        "offset" : offset + len
                    }
            },

            "pack" : function(message, buffer, offset) {
                    var warnings = [];

                    if (buffer.length < offset + ofp.sizes.ofp_error_msg) {
                        return {
                            error : { desc : util.format('%s message at offset %d does not fit the buffer.', message.header.type, offset)}
                        }
                    }

                    buffer.writeUInt8(ofp.ofp_type.OFPT_ERROR, offset + offsetsHeader.type, true);

                    if (message.body.type in ofp.ofp_error_type) {
                        var type = ofp.ofp_error_type[message.body.type];

                        var codeMapName = message.body.type.toLowerCase().replace('ofpet_', 'ofp_') + '_code';
                        if (message.body.code in ofp[codeMapName]) {
                            var code = ofp[codeMapName][message.body.code];
                        } else {
                            var code = 0;
                            warnings.push({desc: util.format('%s message at offset %d has invalid code (%s).', message.header.type, offset, message.body.code)});
                        }

                    } else {
                        var type = 0;
                        var code = 0;
                            warnings.push({desc: util.format('%s message at offset %d has invalid type (%s).', message.header.type, offset, message.body.type)});
                    }

                    buffer.writeUInt16BE(type, offset + offsets.type, true);
                    buffer.writeUInt16BE(code, offset + offsets.code, true);

                    var len = ofp.sizes.ofp_error_msg;
                    if ('data' in message.body) {
                        len += message.body.data.length;
                        message.body.data.copy(buffer, offset + offsets.data);
                    }

                    buffer.writeUInt16BE(len, offset + offsetsHeader.length, true);

                    if (warnings.length == 0) {
                        return {
                            offset : offset + len
                        }
                    } else {
                        return {
                            warnings : warnings,
                            offset : offset + len
                        }
                    }
            }


}

})();
