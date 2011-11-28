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
            },

            "pack" : function(instruction, buffer, offset) {
                    var warnings = [];

                    if (buffer.length < offset + ofp.sizes.ofp_instruction_actions) {
                        return {
                            error : { desc : util.format('%s instruction at offset %d does not fit the buffer.', instruction.header.type, offset)}
                        }
                    }
                    buffer.writeUInt16BE(ofp.ofp_instruction_type.OFPIT_WRITE_ACTIONS, offset + offsets.type, true);
                    buffer.fill(0, offset + offsets.pad, offset + offsets.pad + 4);

                    var pos = offset + offsets.actions;
                    instruction.body.actions.forEach(function(act) {
                        var pack = action.pack(act, buffer, pos);

                        if ('error' in pack) {
                            return pack;
                        }
                        if ('warnings' in pack) {
                            warnings.concat(pack.warnings);
                        }

                        pos = pack.offset;
                    });

                    buffer.writeUInt16BE(pos - offset, offset + offsets.len, true);

                    if (warnings.length == 0) {
                        return {
                            offset : pos
                        }
                    } else {
                        return {
                            warnings: warnings,
                            offset : pos
                        }
                    }
            }


}

})();
