/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('../ofp.js');
var action = require('../action.js');

var offsets = ofp.offsets.ofp_instruction_actions;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var instruction = {
                            "header" : {"type" : 'OFPIT_WRITE_ACTIONS'},
                            "body" : {}
                        };
                    var warnings = [];

                    var len = buffer.readUInt16BE(offset + offsets.len, true);

                    if (len < ofp.sizes.ofp_instruction_actions) {
                        return {
                            "error" : {
                                "desc" : util.format('%s instruction at offset %d has invalid length (%d).', instruction.header.type, offset, len),
                                "type" : 'OFPET_BAD_INSTRUCTION', "code" : 'OFPBIC_UNKNOWN_INST'
                            }
                        }
                    }

                    instruction.body.actions = [];

                    var pos = offset + offsets.actions;
                    while (pos < offset + len) {
                        var act = action.unpack(buffer, pos);
                        if ('error' in act) {
                            return act;
                        }

                        if ('warnings' in act) {
                            warnings.concat(act.warnings);
                        }
                        instruction.body.actions.push(act.action);
                        pos = act.offset;
                    }

                    if (pos != offset + len) {
                        return {
                            "error" : {
                                "desc" : util.format('%s instruction at offset %d has extra bytes (%d).', instructio.header.type, offset, (pos - len)),
                                "type" : 'OFPET_BAD_INSTRUCTION', "code" : 'OFPBIC_UNKNOWN_INST'
                            }
                        }
                    }

                    if (warnings.length == 0) {
                        return {
                            "instruction" : instruction,
                            "offset" : offset + len
                        }
                    } else {
                        return {
                            "instruction" : instruction,
                            "warnings" : warnings,
                            "offset" : offset + len
                        }
                    }
            }

}

})();
