/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('../ofp.js');

var offsets = ofp.offsets.ofp_instruction_write_metadata;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var instruction = {
                            "header" : {"type" : 'OFPIT_WRITE_METADATA'},
                            "body" : {}
                        };

                    var len = buffer.readUInt16BE(offset + offsets.len, true);

                    if (len < ofp.sizes.ofp_instruction_write_metadata) {
                        return {
                            "error" : {
                                "desc" : util.format('%s instruction at offset %d has invalid length (%d).', instruction.header.type, offset, len),
                                "type" : 'OFPET_BAD_INSTRUCTION', "code" : 'OFPBIC_UNKNOWN_INST'
                            }
                        }
                    }

                    //TODO omit fields for special cases
                    instruction.body.metadata      = new Buffer(8);
                    instruction.body.metadata_mask = new Buffer(8);
                    buffer.copy(instruction.body.metadata,      0, offset + offsets.metadata,      offset + offsets.metadata + 8);
                    buffer.copy(instruction.body.metadata_mask, 0, offset + offsets.metadata_mask, offset + offsets.metadata_mask + 8);

                    return {
                        "instruction" : instruction,
                        "offset" : offset + len
                    }
            },

            "pack" : function(instruction, buffer, offset) {

                    if (buffer.length < offset + ofp.sizes.ofp_instruction_write_metadata) {
                        return {
                            error : { desc : util.format('%s instruction at offset %d does not fit the buffer.', instruction.header.type, offset)}
                        }
                    }

                    //TODO handle omitted fields
                    buffer.writeUInt16BE(ofp.ofp_instruction_type.OFPIT_WRITE_METADATA, offset + offsets.type, true);
                    buffer.writeUInt16BE(ofp.sizes.ofp_instruction_write_metadata, offset + offsets.len, true);
                    buffer.fill(0, offset + offsets.pad, offset + offsets.pad + 4);
                    instruction.body.metadata.copy(buffer, offset + offsets.metadata);
                    instruction.body.metadata_mask.copy(buffer, offset + offsets.metadata_mask);

                    return {
                        offset : offset + ofp.sizes.ofp_instruction_write_metadata
                    }
            }

}

})();
