/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('../ofp.js');

var offsetsHeader = ofp.offsets.ofp_header;
var offsets = ofp.offsets.ofp_queue_get_config_request;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var message = {
                            "header" : {"type" : 'OFPT_QUEUE_GET_CONFIG_REQUEST'},
                            "body" : {}
                        };
                    var warnings = [];

                    var len = buffer.readUInt16BE(offset + offsetsHeader.length, true);

                    if (len != ofp.sizes.ofp_queue_get_config_request) {
                        return {
                            "error" : {
                                "desc" : util.format('%s message at offset %d has invalid length (%d).', message.header.type, offset, len),
                                "type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'
                            }
                        }
                    }

                    var port = buffer.readUInt32BE(offset + offsets.port, true);
                    if (port > ofp.ofp_port_no.OFPP_MAX) {
                        if (port != ofp.ofp_port_no.OFPP_ALL) {
                            message.body.port = port;
                            warnings.push({
                                    "desc" : util.format('%s message at offset %d has invalid port (%d).', message.header.type, offset, port),
                                    "type" : 'OFPET_QUEUE_OP_FAILED', "code" : 'OFPQOFC_BAD_PORT'
                                });
                        }
                    } else {
                        message.body.port = port;
                    }

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

                    if (buffer.length < offset + ofp.sizes.ofp_queue_get_config_request) {
                        return {
                            error : { desc : util.format('%s message at offset %d does not fit the buffer.', message.header.type, offset)}
                        }
                    }

                    buffer.writeUInt8(ofp.ofp_type.OFPT_QUEUE_GET_CONFIG_REQUEST, offset + offsetsHeader.type, true);
                    buffer.writeUInt16BE(ofp.sizes.ofp_queue_get_config_request, offset + offsetsHeader.length, true);

                    //TODO: validate (all allowed at all)?
                    if ('port' in message.body) {
                        var port = message.body.port;
                    } else {
                        var port = ofp.ofp_port_no.OFPP_ALL
                    }
                    buffer.writeUInt32BE(port, offset + offsets.port, true);

                    buffer.fill(0, offset + offsets.pad, offset + offsets.pad + 4);

                    if (warnings.length == 0) {
                        return {
                            offset : offset + ofp.sizes.ofp_queue_get_config_request
                        }
                    } else {
                        return {
                            warnings : warnings,
                            offset : offset + ofp.sizes.ofp_queue_get_config_request
                        }
                    }
            }

}

})();


