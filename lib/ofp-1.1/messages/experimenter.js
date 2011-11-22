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
            }

}

})();
