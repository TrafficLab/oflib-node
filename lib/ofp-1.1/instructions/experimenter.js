/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('../ofp.js');

var offsets = ofp.offsets.ofp_instruction_experimenter;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var instruction = {
                            "header" : {"type" : 'OFPIT_EXPERIMENTER'},
                            "body" : {}
                        };

                    var len = buffer.readUInt16BE(offset + offsets.len, true);

                    if (len < ofp.sizes.ofp_instruction_experimenter) {
                        return {
                            "error" : {
                                "desc" : util.format('%s instruction at offset %d has invalid length (%d).', instruction.header.type, offset, len),
                                "type" : 'OFPET_BAD_INSTRUCTION', "code" : 'OFPBIC_UNKNOWN_INST'
                            }
                        }
                    }

                    instruction.body.experimenter = buffer.readUInt32BE(offset + offsets.experimenter, true);

                    var dataLen = len - ofp.sizes.ofp_instruction_experimenter;
                    if (dataLen > 0) {
                        instruction.body.data = new Buffer(dataLen);
                        buffer.copy(instruction.body.data, 0, offset + ofp.sizes.ofp_instruction_experimenter, offset + len);
                    }

                    return {
                        "instruction" : instruction,
                        "offset" : offset + len
                    }
            },

            "pack" : function(instruction, buffer, offset) {
                    var len = ofp.sizes.ofp_instruction_experimenter;
                    if (typeof instruction.body.data != 'undefined') {
                        len += instruction.body.data.length;
                    }

                    if (buffer.length < offset + len) {
                        return {
                            error : { desc : util.format('%s instruction at offset %d does not fit the buffer.', instruction.header.type, offset)}
                        }
                    }
                    buffer.writeUInt16BE(ofp.ofp_instruction_type.OFPIT_EXPERIMENTER, offset + offsets.type, true);
                    buffer.writeUInt16BE(len, offset + offsets.len, true);
                    buffer.writeUInt32BE(instruction.body.experimenter, offset + offsets.experimenter, true);

                    if (typeof instruction.body.data != 'undefined') { 
                        instruction.body.data.copy(buffer, offset + ofp.sizes.ofp_instruction_experimenter);
                    }

                    return {
                        offset : offset + len
                    }
            }

}

})();
