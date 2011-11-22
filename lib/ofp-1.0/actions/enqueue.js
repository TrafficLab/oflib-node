/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('../ofp.js');
var packet = require('../../packet.js');

var offsets = ofp.offsets.ofp_action_enqueue;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var action = {
                            "header" : {"type" : 'OFPAT_ENQUEUE'},
                            "body" : {}
                        };
                    var warnings = [];

                    var len = buffer.readUInt16BE(offset + offsets.len, true);

                    if (len != ofp.sizes.ofp_action_enqueue) {
                        return {
                            "error" : {
                                "desc" : util.format('%s action at offset %d has invalid length (%d).', action.header.type, offset, len),
                                "type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'
                            }
                        }
                    }

                    action.body.port = buffer.readUInt16BE(offset + offsets.port, true);

                    if (action.body.port == 0) {
                        warnings.puish({
                                "desc" : util.format('%s action at offset %d has invalid port (%d).', action.header.type, offset, action.body.port),
                                "type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_OUT_PORT'
                        });
                    } else if (action.body.port > ofp.ofp_port.OFPP_MAX) {
                        if (action.body.port == ofp.ofp_port.OFPP_IN_PORT) {
                            action.body.port = 'OFPP_IN_PORT'
                        } else {
                            warnings.puish({
                                    "desc" : util.format('%s action at offset %d has invalid port (%d).', action.header.type, offset, action.body.port),
                                    "type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_OUT_PORT'
                            });
                        }
                    }

                    action.body.queue_id = buffer.readUInt32BE(offset + offsets.queue_id, true);

                    if (action.body.queue_id == ofp.OFPQ_ALL) {
                        warnings.puish({
                                "desc" : util.format('%s action at offset %d has invalid queue_id (%d).', action.header.type, offset, action.body.queue_id),
                                "type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_ARGUMENT'
                        })
                    }

                    if (warnings.length == 0) {
                        return {
                            "action" : action,
                            "offset" : offset + len
                        }
                    } else {
                        return {
                            "action" : action,
                            "warnings" : warnings,
                            "offset" : offset + len
                        }
                    }
            }

}

})();
