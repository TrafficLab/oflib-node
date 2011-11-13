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
            }

}

})();
