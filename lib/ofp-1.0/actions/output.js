/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('../ofp.js');

var offsets = ofp.offsets.ofp_action_output;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var action = {
                                "header" : {"type" : 'OFPAT_OUTPUT'},
                                "body" : {}
                            };

                    var len = buffer.readUInt16BE(offset + offsets.len, true);

                    if (len != ofp.sizes.ofp_action_output) {
                        return {
                            "error" : {
                                "desc" : util.format('%s action at offset %d has invalid length (%d).', action.header.type, offset, len),
                                "type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'
                            }
                        }
                    }

                    action.body.port = buffer.readUInt16BE(offset + offsets.port, true);

                    if (action.body.port == 0) {
                        return {
                            "action" : action,
                            "warnings" : [{
                                "desc" : util.format('%s action at offset %d has invalid port (%d).', action.header.type, offset, action.body.port),
                                "type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_OUT_PORT'
                            }],
                            "offset" : offset + len
                        }
                    }

                    if (action.body.port <= ofp.ofp_port.OFPP_MAX) {
                        return {
                            "action" : action,
                            "offset" : offset + len
                        }
                    }

                    if (action.body.port == ofp.ofp_port.OFPP_CONTROLLER) {
                        action.body.port = 'OFPP_CONTROLLER';
                        action.body.max_len = buffer.readUInt16BE(offset + offsets.max_len, true);

                        return {
                            "action" : action,
                            "offset" : offset + len
                        }
                    }

                    if (action.body.port == ofp.ofp_port.OFPP_ALL) {
                        action.body.port = 'OFPP_ALL';

                        return {
                            "action" : action,
                            "warnings" : [{
                                "desc" : util.format('%s action at offset %d has invalid port (%d).', action.header.type, offset, action.body.port),
                                "type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_OUT_PORT'
                            }],
                            "offset" : offset + len
                        }
                    }

                    /* special values */
                    if (action.body.port in ofp.ofp_port_rev) {
                        action.body.port = ofp.ofp_port_rev[action.body.port];
                        return {
                            "action" : action,
                            "offset" : offset + len
                        }
                    } else {
                        return {
                            "action" : action,
                            "warnings" : [{
                                "desc" : util.format('%s action at offset %d has invalid port (%d).', action.header.type, offset, action.body.port),
                                "type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_OUT_PORT'
                            }],
                            "offset" : offset + len
                        }
                    }
            }
}

})();
