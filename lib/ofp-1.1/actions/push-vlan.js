/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('../ofp.js');
var packet = require('../../packet.js');

var offsets = ofp.offsets.ofp_action_push;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var action = {
                            "header" : {"type" : 'OFPAT_PUSH_VLAN'},
                            "body" : {}
                        };

                    var len = buffer.readUInt16BE(offset + offsets.len, true);

                    if (len != ofp.sizes.ofp_action_push) {
                        return {
                            "error" : {
                                "desc" : util.format('%s action at offset %d has invalid length (%d).', action.header.type, offset, len),
                                "type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'
                            },
                        }
                    }

                    action.body.ethertype = buffer.readUInt16BE(offset + offsets.ethertype, true);

                    if (action.body.ethertype != packet.ETH_TYPE_VLAN && action.body.ethertype != packet.ETH_TYPE_VLAN_PBB) {
                        return {
                            "action" : action,
                            "warnings" : [{
                                "desc" : util.format('%s action at offset %d has invalid ethertype (%d).', action.header.type, offset, action.body.ethertype),
                                "type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_ARGUMENT'
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
                    if (buffer.length < offset + ofp.sizes.ofp_action_push_vlan) {
                        return {
                            error : { desc : util.format('%s action at offset %d does not fit the buffer.', action.header.type, offset)}
                        }
                    }

                    buffer.writeUInt16BE(ofp.ofp_action_type.OFPAT_PUSH_VLAN, offset + offsets.type, true);
                    buffer.writeUInt16BE(ofp.sizes.ofp_action_push, offset + offsets.len, true);
                    buffer.writeUInt16BE(action.body.ethertype, offset + offsets.ethertype, true);
                    buffer.fill(0, offset + offsets.pad, offsets.pad + 2);

                    return {
                        "offset" : offset + ofp.sizes.ofp_action_push
                    }
            }


}

})();
