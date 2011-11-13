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

                    instruction.body.metadata      = new Buffer(8);
                    instruction.body.metadata_mask = new Buffer(8);
                    buffer.copy(instruction.body.metadata,      0, offset + offsets.metadata,      offset + offsets.metadata + 8);
                    buffer.copy(instruction.body.metadata_mask, 0, offset + offsets.metadata_mask, offset + offsets.metadata_mask + 8);

                    return {
                        "instruction" : instruction,
                        "offset" : offset + len
                    }
            }

}

})();
