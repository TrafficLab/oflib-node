/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('../ofp.js');

var offsets = ofp.offsets.ofp_instruction_goto_table;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var instruction = {
                            "header" : {"type" : 'OFPIT_GOTO_TABLE'},
                            "body" : {}
                        };

                    var len = buffer.readUInt16BE(offset + offsets.len, true);

                    if (len != ofp.sizes.ofp_instruction_goto_table) {
                        return {
                            "error" : {
                                "desc" : util.format('%s instruction at offset %d has invalid length (%d).', instruction.header.type, offset, len),
                                "type" : 'OFPET_BAD_INSTRUCTION', "code" : 'OFPBIC_UNKNOWN_INST'
                            }
                        }
                    }

                    instruction.body.table_id = buffer.readUInt8(offset + offsets.table_id, true);
                    if (instruction.body.table_id > ofp.ofp_table.OFPTT_MAX) {
                        return {
                            "instruction" : instruction,
                            "warnings" : [{
                                "desc" : util.format('%s instruction at offset %d has invalid table_id (%d).', instruction.header.type, offset, instruction.body.table_id),
                                "type" : 'OFPET_BAD_INSTRUCTION', "code" : 'OFPBIC_BAD_TABLE_ID'
                            }],
                            "offset" : offset + len
                        }
                    }

                    return {
                        "instruction" : instruction,
                        "offset" : offset + len
                    }
            }

}

})();
