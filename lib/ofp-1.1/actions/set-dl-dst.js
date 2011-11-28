/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('../ofp.js');
var packet = require('../../packet.js');

var offsets = ofp.offsets.ofp_action_dl_addr;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var action = {
                            "header" : {"type" : 'OFPAT_SET_DL_DST'},
                            "body" : {}
                        };

                    var len = buffer.readUInt16BE(offset + offsets.len, true);

                    if (len != ofp.sizes.ofp_action_dl_addr) {
                        return {
                            "error" : {
                                "desc" : util.format('%s action at offset %d has invalid length (%d).', action.header.type, offset, len),
                                "type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'
                            }
                        }
                    }

                    action.body.dl_addr = packet.ethToString(buffer, offset + offsets.dl_addr);

                    return {
                        "action" : action,
                        "offset" : offset + len
                    }
            },

            "pack" : function(action, buffer, offset) {
                    if (buffer.length < offset + ofp.sizes.ofp_action_dl_addr) {
                        return {
                            error : { desc : util.format('%s action at offset %d does not fit the buffer.', action.header.type, offset)}
                        }
                    }

                    buffer.writeUInt16BE(ofp.ofp_action_type.OFPAT_SET_DL_DST, offset + offsets.type, true);
                    buffer.writeUInt16BE(ofp.sizes.ofp_action_dl_addr, offset + offsets.len, true);

                    packet.stringToEth(action.body.dl_addr, buffer, offset + offsets.dl_addr);
                    buffer.fill(0, offset + offsets.pad, offset + offsets.pad + 6);

                    return {
                        "offset" : offset + ofp.sizes.ofp_action_dl_addr
                    }
            }

}

})();
