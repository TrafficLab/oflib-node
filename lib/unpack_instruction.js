/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

var util = require('util');
var ofp = require('./ofp.js');
var packet = require('./packet.js');

var unpackAction = require('./unpack_action.js');

/*
 * Returns:
 * {"instruction" : <JSON>, "offset" : <offset after instruction> }
 * Error:
 * {"error" : "<error text>" [, "ofp_error" : {"type" : <type>, "code" : <code>}]}
 */
module.exports = function instruction_unpack(buffer, offset) {
        if (buffer.length < offset + ofp.sizes.ofp_instruction) {
            return {
                "error" : util.format('Received instruction is too short (%d).', (buffer.length - offset)),
                "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'}
            }
        }

        var type = buffer.readUInt16BE(offset, true);
        var len  = buffer.readUInt16BE(offset+2, true);

        if (buffer.length < offset + len) {
            return {
                "error" : util.format('Received instruction has invalid length (set to %d, but only %d received).', len, (buffer.length - offset)),
                "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'}
            }
        }

        offset += 4;

        switch (type) {
            case ofp.ofp_instruction_type.OFPIT_GOTO_TABLE: {
                var instruction = {
                    "header" : {"type" : 'OFPIT_GOTO_TABLE'},
                    "body" : {}
                };

                if (len != ofp.sizes.ofp_instruction_goto_table) {
                    return {
                        "error" : util.format('Received %s instruction has invalid length (%d).', instruction.header.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'}
                    }
                }

                instruction.body.table_id = buffer.readUInt8(offset, true);
                offset += 4; /* + pad */

                if (instruction.body.table_id > ofp.ofp_table.OFPTT_MAX) {
                    return {
                        "error" : util.format('Received %s instruction has invalid table_id (%d).', instruction.header.type, instruction.body.table_id),
                        "ofp_error" : {"type" : 'OFPET_BAD_INSTRUCTION', "code" : 'OFPBIC_BAD_TABLE_ID'}
                        }
                }

                return {"instruction" : instruction, "offset" : offset};
            }

            case ofp.ofp_instruction_type.OFPIT_WRITE_METADATA: {
                var instruction = {
                    "header" : {"type" : 'OFPIT_WRITE_METADATA'},
                    "body" : {}
                };

                if (len != ofp.sizes.ofp_instruction_write_metadata) {
                    return {
                        "error" : util.format('Received %s instruction has invalid length (%d).', instruction.header.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'}
                    }
                }

                instruction.body.metadata      = new Buffer(8);
                buffer.copy(instruction.body.metadata, 0, offset + 4, offset + 12);
                instruction.body.metadata_mask = new Buffer(8);
                buffer.copy(instruction.body.metadata_mask, 0, offset + 12, offset + 20);
                offset += 20; /* + pad */

                return {"instruction" : instruction, "offset" : offset};
            }

            case ofp.ofp_instruction_type.OFPIT_WRITE_ACTIONS: {
                var instruction = {
                    "header" : {"type" : 'OFPIT_WRITE_ACTIONS'},
                    "body" : {}
                };

                if (len < ofp.sizes.ofp_instruction_actions) {
                    return {
                        "error" : util.format('Received %s instruction has invalid length (%d).', instruction.header.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'}
                    }
                }

                instruction.body.actions = [];

                offset += 4; /* + pad */
                var actEnd = offset + len - ofp.sizes.ofp_instruction_actions;
                while (offset < actEnd) {
                    var unpack = unpackAction(buffer, offset);
                    if ('error' in unpack) {
                        return unpack;
                    }
                    instruction.body.actions.push(unpack.action);
                    offset = unpack.offset;
                }

                if (offset != actEnd) {
                    return {
                        "error" : util.format('The %s received instruction contained extra bytes (%d).', instruction.header.type, (actEnd - offset)),
                        "ofp_error" : {"type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'}
                    }
                }

                return {"instruction" : instruction, "offset" : offset};
            }

            case ofp.ofp_instruction_type.OFPIT_APPLY_ACTIONS: {
                var instruction = {
                    "header" : {"type" : 'OFPIT_APPLY_ACTIONS'},
                    "body" : {}
                };

                if (len < ofp.sizes.ofp_instruction_actions) {
                    return {
                        "error" : util.format('Received %s instruction has invalid length (%d).', instruction.header.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'}
                    }
                }

                instruction.body.actions = [];

                offset += 4; /* + pad */
                var actEnd = offset + len - ofp.sizes.ofp_instruction_actions;

                while (offset < actEnd) {

                    var unpack = unpackAction(buffer, offset);

                    if ('error' in unpack) {
                        return unpack;
                    }
                    instruction.body.actions.push(unpack.action);

                    offset = unpack.offset;
                }

                if (offset != actEnd) {
                    return {
                        "error" : util.format('The %s received instruction contained extra bytes (%d).', instruction.header.type, (actEnd - offset)),
                        "ofp_error" : {"type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'}
                    }

                }

                return {"instruction" : instruction, "offset" : offset};
            }

            case ofp.ofp_instruction_type.OFPIT_CLEAR_ACTIONS: {
                var instruction = {
                    "header" : {"type" : 'OFPIT_CLEAR_ACTIONS'}
                };

                if (len != ofp.sizes.ofp_instruction_actions) {
                    return {
                        "error" : util.format('Received %s instruction has invalid length (%d).', instruction.header.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'}
                    }
                }

                offset += 4; /* + pad */

                return {"instruction" : instruction, "offset" : offset};
            }

            case ofp.ofp_instruction_type.OFPIT_EXPERIMENTER: {
                /* TODO: experimenter callback */
                var instruction = {
                    "header" : {"type" : 'OFPIT_EXPERIMENTER'}
                };

                if (len < ofp.sizes.ofp_instruction_experimenter) {
                    return {
                        "error" : util.format('Received %s instruction has invalid length (%d).', action.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'}
                    }
                }

                instruction.body.experimenter_id = buffer.readUInt32BE(offset, true);
                //offset += 4;
                offset += len - 4;

                return {"instrcution" : instruction, "offset" : offset};
            }

            default: {
                return {
                    "error" : util.format('Received unknown instruction type (%d).', type),
                    "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_TYPE'}
                }
            }
        }
    }
