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

                    if (flags & ofp.ofp_config_flags.OFPC_INVALID_TTL_TO_CONTROLLER) {
                        message.body.flags.push('OFPC_INVALID_TTL_TO_CONTROLLER');
                    }

                    if (flags > (ofp.ofp_config_flags.OFPC_FRAG_MASK | ofp.ofp_config_flags.OFPC_INVALID_TTL_TO_CONTROLLER)) {
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
            },

            "pack" : function(message, buffer, offset) {
                    var warnings = [];

                    if (buffer.length < offset + ofp.sizes.ofp_switch_config) {
                        return {
                            error : { desc : util.format('%s message at offset %d does not fit the buffer.', message.header.type, offset)}
                        }
                    }

                    buffer.writeUInt8(ofp.ofp_type.OFPT_GET_CONFIG_REPLY, offset + offsetsHeader.type, true);
                    buffer.writeUInt16BE(ofp.sizes.ofp_switch_config, offset + offsetsHeader.length, true);

                    //TODO: validate
                    var flags = 0;
                    message.body.flags.forEach(function(flag) {
                        switch (flag) {
                            case 'OFPC_FRAG_NORMAL': {
                                flags |= ofp.ofp_config_flags.OFPC_FRAG_NORMAL;
                                break;
                            }
                            case 'OFPC_FRAG_DROP': {
                                flags |= ofp.ofp_config_flags.OFPC_FRAG_DROP;
                                break;
                            }
                            case 'OFPC_FRAG_REASM': {
                                flags |= ofp.ofp_config_flags.OFPC_FRAG_REASM;
                                break;
                            }
                            case 'OFPC_INVALID_TTL_TO_CONTROLLER': {
                                flags |= ofp.ofp_config_flags.OFPC_INVALID_TTL_TO_CONTROLLER;
                                break;
                            }
                            default: {
                            }
                        }
                    });
                    buffer.writeUInt16BE(flags, offset + offsets.flags, true);
                    buffer.writeUInt16BE(message.body.miss_send_len, offset + offsets.miss_send_len, true);


                    if (warnings.length == 0) {
                        return {
                            offset : offset + ofp.sizes.ofp_switch_config
                        }
                    } else {
                        return {
                            warnings : warnings,
                            offset : offset + ofp.sizes.ofp_switch_config
                        }
                    }
            }


}

})();
