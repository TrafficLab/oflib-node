/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('../ofp.js');
var packet = require('../../packet.js');

var offsets = ofp.offsets.ofp_action_mpls_label;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var action = {
                            "header" : {"type" : 'OFPAT_SET_MPLS_LABEL'},
                            "body" : {}
                        };

                    var len = buffer.readUInt16BE(offset + offsets.len, true);

                    if (len != ofp.sizes.ofp_action_mpls_label) {
                        return {
                            "error" : {
                                "desc" : util.format('%s action at offset %d has invalid length (%d).', action.header.type, offset, len),
                                "type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'
                            }
                        }
                    }

                    action.body.mpls_label = buffer.readUInt32BE(offset + offsets.mpls_label, true);

                    if (action.body.mpls_label > packet.MPLS_LABEL_MAX) {
                        return {
                            "action" : action,
                            "warnings" : [{
                                "desc" : util.format('%s action at offset %d has invalid label (%d).', action.header.type, offset, action.body.mpls_label),
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
                    if (buffer.length < offset + ofp.sizes.ofp_action_mpls_label) {
                        return {
                            error : { desc : util.format('%s action at offset %d does not fit the buffer.', action.header.type, offset)}
                        }
                    }
                    buffer.writeUInt16BE(ofp.ofp_action_type.OFPAT_SET_MPLS_LABEL, offset + offsets.type, true);
                    buffer.writeUInt16BE(ofp.sizes.ofp_action_mpls_label, offset + offsets.len, true);

                    buffer.writeUInt32BE(action.body.mpls_label, offset + offsets.mpls_label, true);

                    if (action.body.mpls_label > packet.MPLS_LABEL_MAX) {
                        return {
                            warnings: [{
                                desc: util.format('%s action at offset %d has invalid mpls label (%d).', action.header.type, offset, action.body.mpls_label)
                            }],
                            offset : offset + ofp.sizes.ofp_action_mpls_label
                        }
                    }

                    return {
                        offset : offset + ofp.sizes.ofp_action_mpls_label
                    }
            }

}

})();

