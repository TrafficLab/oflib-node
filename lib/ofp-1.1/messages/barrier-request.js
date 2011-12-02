/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('../ofp.js');

var offsets = ofp.offsets.ofp_header;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var message = {
                            "header" : {"type" : 'OFPT_BARRIER_REQUEST'}
                        };

                    var len = buffer.readUInt16BE(offset + offsets.length, true);

                    if (len != ofp.sizes.ofp_header) {
                        return {
                            "error" : {
                                "desc" : util.format('%s message at offset %d has invalid length (%d).', message.header.type, offset, len),
                                "type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'
                            }
                        }
                    }

                    return {
                        "message" : message,
                        "offset" : offset + len
                    }
            },

            "pack" : function(message, buffer, offset) {
                    buffer.writeUInt8(ofp.ofp_type.OFPT_BARRIER_REQUEST, offset + offsets.type, true);
                    buffer.writeUInt16BE(ofp.sizes.ofp_header, offset + offsets.length, true);

                    return {
                        offset : offset + ofp.sizes.ofp_header
                    }
            }

}

})();
