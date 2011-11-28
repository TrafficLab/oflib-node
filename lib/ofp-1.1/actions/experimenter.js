/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('../ofp.js');

var offsets = ofp.offsets.ofp_action_experimenter_header;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var action = {
                            "header" : {"type" : 'OFPAT_EXPERIMENTER'},
                            "body" : {}
                        };

                    var len = buffer.readUInt16BE(offset + offsets.len, true);

                    if (len < ofp.sizes.ofp_action_experimenter_header) {
                        return {
                            "error" : {
                                "desc" : util.format('%s action at offset %d has invalid length (%d).', action.header.type, offset, len),
                                "type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'
                            }
                        }
                    }

                    action.body.experimenter = buffer.readUInt32BE(offset + offsets.experimenter, true);

                    var dataLen = len - ofp.sizes.ofp_action_experimenter_header;
                    if (dataLen > 0) {
                        action.body.data = new Buffer(dataLen);
                        buffer.copy(action.body.data, 0, offset + ofp.sizes.ofp_action_experimenter_header, offset + ofp.sizes.ofp_action_experimenter_header + dataLen);
                    }

                    return {
                        "action" : action,
                        "offset" : offset + len
                    }
            },

            "pack" : function(action, buffer, offset) {
                    var len = ofp.sizes.ofp_action_experimenter_header;
                    if (typeof action.body.data != 'undefined') {
                        len += action.body.data.length;
                    }

                    if (buffer.length < offset + len) {
                        return {
                            error : { desc : util.format('%s action at offset %d does not fit the buffer.', action.header.type, offset)}
                        }
                    }

                    buffer.writeUInt16BE(ofp.ofp_action_type.OFPAT_EXPERIMENTER, offset + offsets.type, true);
                    buffer.writeUInt16BE(len, offset + offsets.len, true);

                    buffer.writeUInt32BE(action.body.experimenter, offset + offsets.experimenter, true);
                    if (typeof action.body.data != 'undefined') {
                        action.body.data.copy(buffer, offset + ofp.sizes.ofp_action_experimenter_header)
                    }

                    return {
                        "offset" : offset + ofp.sizes.ofp_action_output
                    }
            }

}

})();
