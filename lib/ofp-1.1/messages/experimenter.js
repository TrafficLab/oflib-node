/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('../ofp.js');

var offsetsHeader = ofp.offsets.ofp_header;
var offsets = ofp.offsets.ofp_experimenter_header;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var message = {
                            "header" : {"type" : 'OFPT_EXPERIMENTER'},
                            "body" : {}
                        };

                    var len = buffer.readUInt16BE(offset + offsetsHeader.length, true);

                    if (len < ofp.sizes.ofp_experimenter_header) {
                        return {
                            "error" : {
                                "desc" : util.format('%s message at offset %d has invalid length (%d).', message.header.type, offset, len),
                                "type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'
                            }
                        }
                    }

                    message.body.experimenter = buffer.readUInt32BE(offset + offsets.experimenter, true);

                    // Note: Padding might also contain data
                    var dataLen = len - offsets.pad;
                    if (dataLen > 0) {
                        message.body.data = new Buffer(dataLen);
                        buffer.copy(message.body.data, 0, offset + offsets.pad, offset + offsets.pad + dataLen);
                    }

                    return {
                        "message" : message,
                        "offset" : offset + len
                    }
            },

            "pack" : function(message, buffer, offset) {
                    var warnings = [];

                    if (buffer.length < offset + ofp.sizes.ofp_experimenter_header) {
                        return {
                            error : { desc : util.format('%s message at offset %d does not fit the buffer.', message.header.type, offset)}
                        }
                    }

                    buffer.writeUInt8(ofp.ofp_type.OFPT_EXPERIMENTER, offset + offsetsHeader.type, true);

                    buffer.writeUInt32BE(message.body.experimenter, offset + offsets.experimenter, true);

                    if ('data' in message.body) {
                        var dataLen = message.body.data.length;
                        message.body.data.copy(buffer, offset + offsets.pad);
                    } else {
                        var dataLen = 0;
                    }

                    if (dataLen < 4) {
                        buffer.fill(0, offset + offsets.pad + dataLen, offset + offsets.pad + 4);
                        var len = offset + ofp.sizes.ofp_experimenter_header;
                    } else {
                        var len = offset + ofp.sizes.ofp_experimenter_header + dataLen - 4;
                    }

                    if (warnings.length == 0) {
                        return {
                            offset : len
                        }
                    } else {
                        return {
                            warnings: warnings,
                            offset : len
                        }
                    }
        }


}

})();
