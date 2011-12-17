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

var unpack = {};
unpack[ofp.ofp_instruction_type.OFPIT_GOTO_TABLE]     = gotoTable.unpack;
unpack[ofp.ofp_instruction_type.OFPIT_WRITE_METADATA] = writeMetadata.unpack;
unpack[ofp.ofp_instruction_type.OFPIT_WRITE_ACTIONS]  = writeActions.unpack;
unpack[ofp.ofp_instruction_type.OFPIT_APPLY_ACTIONS]  = applyActions.unpack;
unpack[ofp.ofp_instruction_type.OFPIT_CLEAR_ACTIONS]  = clearActions.unpack;
unpack[ofp.ofp_instruction_type.OFPIT_EXPERIMENTER]   = experimenter.unpack;

var pack = {
    OFPIT_GOTO_TABLE     : gotoTable.pack,
    OFPIT_WRITE_METADATA : writeMetadata.pack,
    OFPIT_WRITE_ACTIONS  : writeActions.pack,
    OFPIT_APPLY_ACTIONS  : applyActions.pack,
    OFPIT_CLEAR_ACTIONS  : clearActions.pack,
    OFPIT_EXPERIMENTER   : experimenter.pack
};

var offsets = ofp.offsets.ofp_instruction;

module.exports = {
    struct : 'instruction',

    unpack : function(buffer, offset) {
                var len, type, unpacked;

                if (buffer.length < offset + ofp.sizes.ofp_instruction) {
                    return {
                        error : {
                            desc : util.format('instruction at offset %d is too short (%d).', offset, (buffer.length - offset)),
                            type : 'OFPET_BAD_INSTRUCTION', code : 'OFPBIC_UNKNOWN_INST'
                        }
                    };
                }

                len = buffer.readUInt16BE(offset + offsets.len, true);

                if (buffer.length < offset + len) {
                    return {
                        error : {
                            desc : util.format('instruction at offset %d has invalid length (set to %d, but only %d received).', offset, len, (buffer.length - offset)),
                            type : 'OFPET_BAD_INSTRUCTION', code : 'OFPBIC_UNKNOWN_INST'
                        }
                    };
                }

                type = buffer.readUInt16BE(offset + offsets.type, true);

                if (typeof unpack[type] !== 'undefined') {
                    unpacked = (unpack[type])(buffer, offset);
                } else {
                    return {
                        error : {
                            desc : util.format('instruction at offset %d has invalid type (%d).', type),
                            type : 'OFPET_BAD_INSTRUCTION', code : 'OFPBIC_UNKNOWN_INST'
                        }
                    };
                }

                return unpacked;
    },

    pack : function(instruction, buffer, offset) {
                var type, packed;

                if (buffer.length < offset + ofp.sizes.ofp_instruction) {
                    return {
                        error : { desc : util.format('instruction at offset %d does not fit the buffer.', offset)}
                    };
                }

                type = instruction.header.type;

                if (typeof pack[type] !== 'undefined') {
                    packed = (pack[type])(instruction, buffer, offset);
                } else {
                    return {
                        error : {
                            desc : util.format('unknown instruction at %d (%s).', offset, instruction.header.type)
                        }
                    };
                }

                return packed;
    }
};

}());
