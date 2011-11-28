/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('../ofp.js');
var packet = require('../../packet.js');

var offsets = ofp.offsets.ofp_action_mpls_tc;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var action = {
                            "header" : {"type" : 'OFPAT_SET_MPLS_TC'},
                            "body" : {}
                        };

                    var len = buffer.readUInt16BE(offset + offsets.len, true);

                    if (len != ofp.sizes.ofp_action_mpls_tc) {
                        return {
                            "error" : {
                                "desc" : util.format('%s action at offset %d has invalid length (%d).', action.header.type, offset, len),
                                "type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'
                            }
                        }
                    }

                    action.body.mpls_tc = buffer.readUInt8(offset + offsets.mpls_tc, true);

                    if (action.body.mpls_tc > packet.MPLS_TC_MAX) {
                        return {
                            "action" : action,
                            "warnings" : [{
                                "desc" : util.format('%s action at offset %d has invalid tc (%d).', action.header.type, offset, action.body.mpls_label),
                                "type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_OUT_ARGUMENT'
                            }],
                            "offset" : offset + len
                        }
                    }

                    return {
                        "action" : action,
                        "offset" : offset + len
                    }
            },

            "pack" : function(action, buffer, offset) {
                    if (buffer.length < offset + ofp.sizes.ofp_action_mpls_tc) {
                        return {
                            error : { desc : util.format('%s action at offset %d does not fit the buffer.', action.header.type, offset)}
                        }
                    }
                    buffer.writeUInt16BE(ofp.ofp_action_type.OFPAT_SET_MPLS_TC, offset + offsets.type, true);
                    buffer.writeUInt16BE(ofp.sizes.ofp_action_mpls_tc, offset + offsets.len, true);
                    buffer.writeUInt8(action.body.mpls_tc, offset + offsets.mpls_tc, true);
                    buffer.fill(0, offset + offsets.pad, offset + offsets.pad + 3);

                    if (action.body.mpls_tc > packet.MPLS_TC_MAX) {
                        return {
                            warnings: [{
                                desc: util.format('%s action at offset %d has invalid mpls tc (%d).', action.header.type, offset, action.body.mpls_tc)
                            }],
                            offset : offset + ofp.sizes.ofp_action_mpls_tc
                        }
                    }

                    return {
                        offset : offset + ofp.sizes.ofp_action_mpls_tc
                    }
            }


}

})();
