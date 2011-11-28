/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('../ofp.js');
var packet = require('../../packet.js');

var offsets = ofp.offsets.ofp_action_vlan_vid;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var action = {
                            "header" : {"type" : 'OFPAT_SET_VLAN_VID'},
                            "body" : {}
                        };

                    var len = buffer.readUInt16BE(offset + offsets.len, true);

                    if (len != ofp.sizes.ofp_action_vlan_vid) {
                        return {
                            "error" : {
                                "desc" : util.format('%s action at offset %d has invalid length (%d).', action.header.type, offset, len),
                                "type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'
                            }
                        }
                    }

                    action.body.vlan_vid = buffer.readUInt16BE(offset + offsets.vlan_vid, true);

                    if (action.body.vlan_vid > packet.VLAN_VID_MAX) {
                        return {
                            "action" : action,
                            "warnings" : [{
                                "desc" : util.format('%s action at offset %d has invalid vid (%d).', action.header.type, offset, action.body.vlan_vid),
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
                    if (buffer.length < offset + ofp.sizes.ofp_action_vlan_vid) {
                        return {
                            error : { desc : util.format('%s action at offset %d does not fit the buffer.', action.header.type, offset)}
                        }
                    }
                    buffer.writeUInt16BE(ofp.ofp_action_type.OFPAT_SET_VLAN_VID, offset + offsets.type, true);
                    buffer.writeUInt16BE(ofp.sizes.ofp_action_vlan_vid, offset + offsets.len, true);
                    buffer.writeUInt16BE(action.body.vlan_vid, offset + offsets.vlan_vid, true);
                    buffer.fill(0, offset + offsets.pad, offset + offsets.pad + 2);

                    if (action.body.vlan_vid > packet.VLAN_VID_MAX) {
                        return {
                            warnings: [{
                                desc: util.format('%s action at offset %d has invalid vlan vid (%d).', action.header.type, offset, action.body.vlan_vid)
                            }],
                            offset : offset + ofp.sizes.ofp_action_vlan_vid
                        }
                    }

                    return {
                        offset : offset + ofp.sizes.ofp_action_vlan_vid
                    }
            }

}

})();
