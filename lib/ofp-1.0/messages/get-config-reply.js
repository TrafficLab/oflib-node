/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('../ofp.js');

var offsetsHeader = ofp.offsets.ofp_header;
var offsets = ofp.offsets.ofp_switch_config;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var message = {
                            "header" : {"type" : 'OFPT_GET_CONFIG_REPLY'},
                            "body" : {}
                        };
                    var warnings = [];

                    var len = buffer.readUInt16BE(offset + offsetsHeader.length, true);

                    if (len != ofp.sizes.ofp_switch_config) {
                        return {
                            "error" : {
                                "desc" : util.format('%s message at offset %d has invalid length (%d).', message.header.type, offset, len)
                            }
                        }
                    }


                    message.body.flags = [];

                    var flags = buffer.readUInt16BE(offset + offsets.flags, true);

                    switch(flags & ofp.ofp_config_flags.OFPC_FRAG_MASK) {
                        case ofp.ofp_config_flags.OFPC_FRAG_NORMAL : {
                            message.body.flags.push('OFPC_FRAG_NORMAL');
                            break;
                        }
                        case ofp.ofp_config_flags.OFPC_FRAG_DROP : {
                            message.body.flags.push('OFPC_FRAG_DROP');
                            break;
                        }
                        case ofp.ofp_config_flags.OFPC_FRAG_REASM : {
                            message.body.flags.push('OFPC_FRAG_REASM');
                            break;
                        }
                        default : {
                            warnings.push({"desc" : util.format("%s message at offset %d has invalid frag flags (%d).", message.header.type, offset, flags & ofp.ofp_config_flags.OFPC_FRAG_MASK)});
                        }
                    }

                    if (flags > ofp.ofp_config_flags.OFPC_FRAG_MASK) {
                        warnings.push({"desc" : util.format("%s message at offset %d has invalid flags (%d).", message.header.type, offset, flags)});
                    }

                    message.body.miss_send_len = buffer.readUInt16BE(offset + offsets.miss_send_len, true);
                    // TODO: validate?

                    if (warnings.length == 0) {
                        return {
                            "message" : message,
                            "offset" : offset + len
                        }
                    } else {
                        return {
                            "message" : message,
                            "warnings" : warnings,
                            "offset" : offset + len
                        }
                    }
            }

}

})();
