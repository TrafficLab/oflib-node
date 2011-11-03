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
 * {"error" : "<error text>" [, "ofp_error_type" : <ofp error type>, "ofp_error_code" : <ofp error code>]}
 */
module.exports = function instruction_unpack(buffer, offset) {
        var instruction = {};

        if (buffer.length < offset + ofp.sizes.ofp_instruction) {
            return {
                "error" : util.format('Received instruction is too short (%d).', (buffer.length - offset)),
                "ofp_error_type" : 'OFPET_BAD_ACTION',
                "ofp_error_code" : 'OFPBAC_BAD_LEN'
            }
        }

        var type = buffer.readUInt16BE(offset, true);
        var len  = buffer.readUInt16BE(offset+2, true);

        if (buffer.length < offset + len) {
            return {
                "error" : util.format('Received instruction has invalid length (set to %d, but only %d received).', len, (buffer.length - offset)),
                "ofp_error_type" : 'OFPET_BAD_ACTION',
                "ofp_error_code" : 'OFPBAC_BAD_LEN'
            }
        }

        offset += 4;

        switch (type) {
            case ofp.ofp_instruction_type.OFPIT_GOTO_TABLE: {
                instruction.type = 'OFPIT_GOTO_TABLE';

                if (len != ofp.sizes.ofp_instruction_goto_table) {
                    return {
                        "error" : util.format('Received %s instruction has invalid length (%d).', instruction.type, len),
                        "ofp_error_type" : 'OFPET_BAD_ACTION',
                        "ofp_error_code" : 'OFPBAC_BAD_LEN'
                    }
                }

                instruction.table_id = buffer.readUInt8(offset, true);
                offset += 4; /* + pad */

                if (instruction.table_id > ofp.ofp_table.OFPTT_MAX) {
                    return {
                        "error" : util.format('Received %s instruction has invalid table_id (%d).', instruction.type, instruction.table_id),
                        "ofp_error_type" : 'OFPET_BAD_INSTRUCTION',
                        "ofp_error_code" : 'OFPBIC_BAD_TABLE_ID'
                        }
                }

                return {"instruction" : instruction, "offset" : offset};
            }

            case ofp.ofp_instruction_type.OFPIT_WRITE_METADATA: {
                instruction.type = 'OFPIT_WRITE_METADATA';

                if (len != ofp.sizes.ofp_instruction_write_metadata) {
                    return {
                        "error" : util.format('Received %s instruction has invalid length (%d).', instruction.type, len),
                        "ofp_error_type" : 'OFPET_BAD_ACTION',
                        "ofp_error_code" : 'OFPBAC_BAD_LEN'
                    }
                }

                instruction.metadata      = buffer.toString('hex', offset + 4, offset + 12);
                instruction.metadata_mask = buffer.toString('hex', offset + 12, offset + 20);
                offset += 20; /* + pad */

                return {"instruction" : instruction, "offset" : offset};
            }

            case ofp.ofp_instruction_type.OFPIT_WRITE_ACTIONS: {
                instruction.type = 'OFPIT_WRITE_ACTIONS';

                if (len < ofp.sizes.ofp_instruction_actions) {
                    return {
                        "error" : util.format('Received %s instruction has invalid length (%d).', instruction.type, len),
                        "ofp_error_type" : 'OFPET_BAD_ACTION',
                        "ofp_error_code" : 'OFPBAC_BAD_LEN'
                    }
                }

                instruction.actions = [];

                offset += 4; /* + pad */
                var actEnd = offset + len - ofp.sizes.ofp_instruction_actions;
                while (offset < actEnd) {
                    var unpack = unpackAction(buffer, offset);
                    if ('error' in unpack) {
                        return unpack;
                    }
                    instruction.actions.push(unpack.action);
                    offset = unpack.offset;
                }

                if (offset != actEnd) {
                    return {
                        "error" : util.format('The %s received instruction contained extra bytes (%d).', instruction.type, (actEnd - offset)),
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
                    }
                }

                return {"instruction" : instruction, "offset" : offset};
            }

            case ofp.ofp_instruction_type.OFPIT_APPLY_ACTIONS: {
                instruction.type = 'OFPIT_APPLY_ACTIONS';

                if (len < ofp.sizes.ofp_instruction_actions) {
                    return {
                        "error" : util.format('Received %s instruction has invalid length (%d).', instruction.type, len),
                        "ofp_error_type" : 'OFPET_BAD_ACTION',
                        "ofp_error_code" : 'OFPBAC_BAD_LEN'
                    }
                }

                instruction.actions = [];

                offset += 4; /* + pad */
                var actEnd = offset + len - ofp.sizes.ofp_instruction_actions;

                while (offset < actEnd) {

                    var unpack = unpackAction(buffer, offset);

                    if ('error' in unpack) {
                        return unpack;
                    }
                    instruction.actions.push(unpack.action);

                    offset = unpack.offset;
                }

                if (offset != actEnd) {
                    return {
                        "error" : util.format('The %s received instruction contained extra bytes (%d).', instruction.type, (actEnd - offset)),
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
                    }

                }

                return {"instruction" : instruction, "offset" : offset};
            }

            case ofp.ofp_instruction_type.OFPIT_CLEAR_ACTIONS: {
                instruction.type = 'OFPIT_CLEAR_ACTIONS';

                if (len != ofp.sizes.ofp_instruction_actions) {
                    return {
                        "error" : util.format('Received %s instruction has invalid length (%d).', instruction.type, len),
                        "ofp_error_type" : 'OFPET_BAD_ACTION',
                        "ofp_error_code" : 'OFPBAC_BAD_LEN'
                    }
                }

                offset += 4; /* + pad */

                return {"instruction" : instruction, "offset" : offset};
            }

            case ofp.ofp_instruction_type.OFPIT_EXPERIMENTER: {
                /* TODO: experimenter callback */
                instruction.type = 'OFPIT_EXPERIMENTER';

                if (len < ofp.sizes.ofp_instruction_experimenter) {
                    return {
                        "error" : util.format('Received %s instruction has invalid length (%d).', action.type, len),
                        "ofp_error_type" : 'OFPET_BAD_ACTION',
                        "ofp_error_code" : 'OFPBAC_BAD_LEN'
                    }
                }

                instruction.experimenter_id = buffer.readUInt32BE(offset, true);
                //offset += 4;
                offset += len - 4;

                return {"instrcution" : instruction, "offset" : offset};
            }

            default: {
                return {
                    "error" : util.format('Received unknown instruction type (%d).', type),
                    "ofp_error_type" : 'OFPET_BAD_ACTION',
                    "ofp_error_code" : 'OFPBAC_BAD_TYPE'
                }
            }
        }
    }
