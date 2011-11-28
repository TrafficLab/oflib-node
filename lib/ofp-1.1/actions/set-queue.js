/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('../ofp.js');
var packet = require('../../packet.js');

var offsets = ofp.offsets.ofp_action_set_queue;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var action = {
                            "header" : {"type" : 'OFPAT_SET_QUEUE'},
                            "body" : {}
                        };

                    var len = buffer.readUInt16BE(offset + offsets.len, true);

                    if (len != ofp.sizes.ofp_action_set_queue) {
                        return {
                            "error" : {
                                "desc" : util.format('%s action at offset %d has invalid length (%d).', action.header.type, offset, len),
                                "type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'
                            }
                        }
                    }

                    action.body.queue_id = buffer.readUInt32BE(offset + offsets.queue_id, true);

                    if (action.body.queue_id == ofp.OFPQ_ALL) {
                        return {
                            "action" : action,
                            "warnings" : [{
                                "desc" : util.format('%s action at offset %d has invalid queue_id (%d).', action.header.type, offset, action.body.queue_id),
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
                    if (buffer.length < offset + ofp.sizes.ofp_action_set_queue) {
                        return {
                            error : { desc : util.format('%s action at offset %d does not fit the buffer.', action.header.type, offset)}
                        }
                    }

                    buffer.writeUInt16BE(ofp.ofp_action_type.OFPAT_SET_QUEUE, offset + offsets.type, true);
                    buffer.writeUInt16BE(ofp.sizes.ofp_action_set_queue, offset + offsets.len, true);
                    buffer.writeUInt32BE(action.body.queue_id, offset + offsets.queue_id, true);

                    if (action.body.queue_id < ofp.OFPQ_ALL) {
                        return {
                            "offset" : offset + ofp.sizes.ofp_action_set_queue
                        }
                    }

                    return {
                        "warnings" : [{
                            "desc" : util.format('%s action at offset %d has invalid queue_id (%d).', action.header.type, offset, action.body.queue_id),
                        }],
                        "offset" : offset + ofp.sizes.ofp_action_set_queue
                    }
            }

}

})();
