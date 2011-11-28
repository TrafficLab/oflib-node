/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('./ofp.js');

var applyActions = require('./instructions/apply-actions.js');
var clearActions = require('./instructions/clear-actions.js');
var experimenter = require('./instructions/experimenter.js');
var gotoTable = require('./instructions/goto-table.js');
var writeActions  = require('./instructions/write-actions.js');
var writeMetadata = require('./instructions/write-metadata.js');

var offsets = ofp.offsets.ofp_instruction;

module.exports = {
            "unpack" : function(buffer, offset) {

                            if (buffer.length < offset + ofp.sizes.ofp_instruction) {
                                return {
                                    "error" : {
                                        "desc" : util.format('instruction at offset %d is too short (%d).', offset, (buffer.length - offset)),
                                        "type" : 'OFPET_BAD_INSTRUCTION', "code" : 'OFPBIC_UNKNOWN_INST'
                                    }
                                }
                            }

                            var len = buffer.readUInt16BE(offset + offsets.len, true);

                            if (buffer.length < offset + len) {
                                return {
                                    "error" : {
                                        "desc" : util.format('instruction at offset %d has invalid length (set to %d, but only %d received).', offset, len, (buffer.length - offset)),
                                        "type" : 'OFPET_BAD_INSTRUCTION', "code" : 'OFPBIC_UNKNOWN_INST'
                                    }
                                }
                            }

                            var type = buffer.readUInt16BE(offset + offsets.type, true);

                            switch (type) {
                                case ofp.ofp_instruction_type.OFPIT_GOTO_TABLE: { return gotoTable.unpack(buffer, offset); }
                                case ofp.ofp_instruction_type.OFPIT_WRITE_METADATA: { return writeMetadata.unpack(buffer, offset); }
                                case ofp.ofp_instruction_type.OFPIT_WRITE_ACTIONS: { return writeActions.unpack(buffer, offset); }
                                case ofp.ofp_instruction_type.OFPIT_APPLY_ACTIONS: { return applyActions.unpack(buffer, offset); }
                                case ofp.ofp_instruction_type.OFPIT_CLEAR_ACTIONS: { return clearActions.unpack(buffer, offset); }
                                case ofp.ofp_instruction_type.OFPIT_EXPERIMENTER: { return experimenter.unpack(buffer, offset); }
                                default: {
                                    return {
                                        "error" : {
                                            "desc" : util.format('instruction at offset %d has invalid type (%d).', type),
                                            "type" : 'OFPET_BAD_INSTRUCTION', "code" : 'OFPBIC_UNKNOWN_INST'
                                        }
                                    }
                                }
                            }
                    },

            "pack" : function(instruction, buffer, offset) {
                        if (buffer.length < offset + ofp.sizes.ofp_instruction) {
                            return {
                                error : { desc : util.format('instruction at offset %d does not fit the buffer.', offset)}
                            }
                        }

                        switch (instruction.header.type) {
                            case 'OFPIT_GOTO_TABLE': { return gotoTable.pack(instruction, buffer, offset); }
                            case 'OFPIT_WRITE_METADATA': { return writeMetadata.pack(instruction, buffer, offset); }
                            case 'OFPIT_WRITE_ACTIONS': { return writeActions.pack(instruction, buffer, offset); }
                            case 'OFPIT_APPLY_ACTIONS': { return applyActions.pack(instruction, buffer, offset); }
                            case 'OFPIT_CLEAR_ACTIONS': { return clearActions.pack(instruction, buffer, offset); }
                            case 'OFPIT_EXPERIMENTER': { return experimenter.pack(instruction, buffer, offset); }
                            default: {
                                return {
                                    "error" : {
                                        "desc" : util.format('unknown instruction at %d (%s).', offset, instruction.header.type)
                                    }
                                }
                            }
                        }

            }

}

})();
