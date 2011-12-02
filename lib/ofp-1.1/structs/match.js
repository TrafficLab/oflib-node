/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('../ofp.js');

var standard = require('./matches/standard.js');

var offsets = ofp.offsets.ofp_match; // there is no separate match header defined in 1.1

module.exports = {
            "struct" : 'match',

            "unpack" : function(buffer, offset) {

                            if (buffer.length < offset + offsets.in_port) { // match for length only
                                return {
                                    "error" : {
                                        "desc" : util.format('match at offset %d is too short (%d).', offset, (buffer.length - offset)),
                                        "type" : 'OFPET_BAD_MATCH', "code" : 'OFPBMC_BAD_LEN'
                                    }
                                }
                            }

                            var len = buffer.readUInt16BE(offset + offsets.length, true);

                            if (buffer.length < offset + len) {
                                return {
                                    "error" : {
                                        "desc" : util.format('match at offset %d has invalid length (set to %d, but only %d received).', offset, len, (buffer.length - offset)),
                                        "type" : 'OFPET_BAD_MATCH', "code" : 'OFPBMC_BAD_LEN'
                                    }
                                }
                            }

                            var type = buffer.readUInt16BE(offset + offsets.type, true);

                            switch (type) {
                                case ofp.ofp_match_type.OFPMT_STANDARD: { return standard.unpack(buffer, offset); }
                                // TODO: experimenter
                                default: {
                                    return {
                                        "error" : {
                                            "desc" : util.format('match at offset %d has invalid type (%d).', offset, type),
                                        }
                                    }
                                }
                            }
                    },


            "pack" : function(match, buffer, offset) {
                        if (buffer.length < offset + offsets.in_port) { // match for length only
                            return {
                                error : { desc : util.format('match at offset %d does not fit the buffer.', offset)}
                            }
                        }

                        switch (match.header.type) {
                            case 'OFPMT_STANDARD': { return standard.pack(match, buffer, offset); }
                            default: {
                                return {
                                    "error" : {
                                        "desc" : util.format('unknown match at %d (%s).', offset, match.header.type)
                                    }
                                }
                            }
                        }

            }

}

})();
