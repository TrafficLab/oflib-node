/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('../ofp.js');

var offsets = ofp.offsets.ofp_action_group;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var action = {
                            "header" : {"type" : 'OFPAT_GROUP'},
                            "body" : {}
                        };

                    var len = buffer.readUInt16BE(offset + offsets.len, true);

                    if (len != ofp.sizes.ofp_action_group) {
                        return {
                            "error" : {
                                "desc" : util.format('%s action at offset %d has invalid length (%d).', action.header.type, offset, len),
                                "type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'
                            }
                        }
                    }

                    action.body.group_id = buffer.readUInt32BE(offset + offsets.group_id, true);

                    if (action.body.group_id > ofp.ofp_group.OFPG_MAX) {
                        return {
                            "action" : action,
                            "warnings" : [{
                                "desc" : util.format('%s action at offset %d has invalid group_id (%d).', action.header.type, offset, action.body.group_id),
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
                    if (buffer.length < offset + ofp.sizes.ofp_action_group) {
                        return {
                            error : { desc : util.format('%s action at offset %d does not fit the buffer.', action.header.type, offset)}
                        }
                    }

                    buffer.writeUInt16BE(ofp.ofp_action_type.OFPAT_GROUP, offset + offsets.type, true);
                    buffer.writeUInt16BE(ofp.sizes.ofp_action_group, offset + offsets.len, true);
                    buffer.writeUInt32BE(action.body.group_id, offset + offsets.group_id, true);

                    if (action.body.group_id <= ofp.ofp_group.OFPG_MAX) {
                        return {
                            "offset" : offset + ofp.sizes.ofp_action_group
                        }
                    }

                    return {
                        "warnings" : [{
                            "desc" : util.format('%s action at offset %d has invalid group (%d).', action.header.type, offset, action.body.group),
                        }],
                        "offset" : offset + ofp.sizes.ofp_action_group
                    }
            }


}

})();
