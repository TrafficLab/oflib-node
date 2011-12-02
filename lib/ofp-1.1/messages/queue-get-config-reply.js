/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('../ofp.js');

var queue = require('../structs/packet-queue.js');

var offsetsHeader = ofp.offsets.ofp_header;
var offsets = ofp.offsets.ofp_queue_get_config_reply;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var message = {
                            "header" : {"type" : 'OFPT_QUEUE_GET_CONFIG_REPLY'},
                            "body" : {}
                        };
                    var warnings = [];

                    var len = buffer.readUInt16BE(offset + offsetsHeader.length, true);

                    if (len < ofp.sizes.ofp_queue_get_config_reply) {
                        return {
                            "error" : {
                                "desc" : util.format('%s message at offset %d has invalid length (%d).', message.header.type, offset, len),
                            }
                        }
                    }

                    var port = buffer.readUInt32BE(offset + offsets.port, true);
                    if (port > ofp.ofp_port_no.OFPP_MAX) {
                        warnings.push({
                            "desc" : util.format('%s message at offset %d has invalid length (%d).', message.header.type, offset, len)
                        });
                    }
                    message.body.port = port;

                    message.body.queues = [];

                    var pos = offset + offsets.queues;
                    while (pos < offset + len) {
                        var unpack = queue.unpack(buffer, pos);
                        if ('error' in unpack) {
                            return unpack;
                        }

                        if ('warnings' in unpack) {
                            warnings.concat(unpack.warnings);
                        }

                        message.body.queues.push(unpack['packet-queue']);
                        pos = unpack.offset;
                    }

                    if (pos != offset + len) {
                        return {
                            "error" : {
                                "desc" : util.format('%s message at offset %d has extra bytes (%d).', message.header.type, offset, (pos - len)),
                            }
                        }
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

                    if (buffer.length < offset + ofp.sizes.ofp_queue_get_config_reply) {
                        return {
                            error : { desc : util.format('%s message at offset %d does not fit the buffer.', message.header.type, offset)}
                        }
                    }

                    buffer.writeUInt8(ofp.ofp_type.OFPT_QUEUE_GET_CONFIG_REPLY, offset + offsetsHeader.type, true);

                    //TODO: validate
                    buffer.writeUInt32BE(message.body.port, offset + offsets.port, true);

                    buffer.fill(0, offset + offsets.pad, offset + offsets.pad + 4);

                    var pos = offset + offsets.queues;
                    message.body.queues.forEach(function(q) {
                        var pack = queue.pack(q, buffer, pos);

                        if ('error' in pack) {
                            return pack;
                        }
                        if ('warnings' in pack) {
                            warnings.concat(pack.warnings);
                        }

                        pos = pack.offset;
                    });

                    buffer.writeUInt16BE(pos - offset, offset + offsetsHeader.length, true);

                    if (warnings.length == 0) {
                        return {
                            offset : pos
                        }
                    } else {
                        return {
                            warnings: warnings,
                            offset : pos
                        }
                    }
            }

}

})();
