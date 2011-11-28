/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('../ofp.js');

var offsets = ofp.offsets.ofp_action_header;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var action = {
                            "header" : {"type" : 'OFPAT_COPY_TTL_IN'}
                        };

                    var len = buffer.readUInt16BE(offset + offsets.len, true);

                    if (len != ofp.sizes.ofp_action_header) {
                        return {
                            "error" : {
                                "desc" : util.format('%s action at offset %d has invalid length (%d).', action.header.type, offset, len),
                                "type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'
                            }
                        }
                    }

                    return {
                        "action" : action,
                        "offset" : offset + len
                    }
            },

            "pack" : function(action, buffer, offset) {
                    buffer.writeUInt16BE(ofp.ofp_action_type.OFPAT_COPY_TTL_IN, offset + offsets.type, true);
                    buffer.writeUInt16BE(ofp.sizes.ofp_action_header, offset + offsets.len, true);
                    buffer.fill(0, offset + offsets.pad, offset + offsets.pad + 4);

                    return {
                        offset : offset + ofp.sizes.ofp_action_header
                    }
            }

}

})();
