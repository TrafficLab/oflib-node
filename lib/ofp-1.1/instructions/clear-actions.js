/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('../ofp.js');

var offsets = ofp.offsets.ofp_instruction_actions;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var instruction = {
                            "header" : {"type" : 'OFPIT_CLEAR_ACTIONS'}
                        };

                    var len = buffer.readUInt16BE(offset + offsets.len, true);

                    if (len != ofp.sizes.ofp_instruction_actions) {
                        return {
                            "error" : {
                                "desc" : util.format('%s instruction at offset %d has invalid length (%d).', instruction.header.type, offset, len),
                                "type" : 'OFPET_BAD_INSTRUCTION', "code" : 'OFPBIC_UNKNOWN_INST'
                            }
                        }
                    }

                    return {
                        "instruction" : instruction,
                        "offset" : offset + len
                    }
            },

            "pack" : function(instruction, buffer, offset) {

                    if (buffer.length < offset + ofp.sizes.ofp_instruction_actions) {
                        return {
                            error : { desc : util.format('%s instruction at offset %d does not fit the buffer.', instruction.header.type, offset)}
                        }
                    }
                    buffer.writeUInt16BE(ofp.ofp_instruction_type.OFPIT_CLEAR_ACTIONS, offset + offsets.type, true);
                    buffer.writeUInt16BE(ofp.sizes.ofp_instruction_actions, offset + offsets.len, true);
                    buffer.fill(0, offset + offsets.pad, offset + offsets.pad + 4);

                    return {
                        offset : offset + ofp.sizes.ofp_instruction_actions
                    }
            }

}

})();
