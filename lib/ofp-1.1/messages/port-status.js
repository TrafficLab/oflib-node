/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('../ofp.js');
var ofputil = require('../../util.js');

var port = require('../structs/port.js');

var offsetsHeader = ofp.offsets.ofp_header;
var offsets = ofp.offsets.ofp_port_status;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var message = {
                            "header" : {"type" : 'OFPT_PORT_STATUS'},
                            "body" : {}
                        };
                    var warnings = [];

                    var len = buffer.readUInt16BE(offset + offsetsHeader.length, true);

                    if (len != ofp.sizes.ofp_port_status) {
                        return {
                            "error" : {
                                "desc" : util.format('%s message at offset %d has invalid length (%d).', message.header.type, offset, len)
                            }
                        }
                    }

                    var reason = buffer.readUInt8(offset + offsets.reason, true);
                    if (!(ofputil.setEnum(message.body, 'reason', reason, ofp.ofp_port_reason_rev))) {
                        message.body.reason = reason;
                        warnings.push({
                                "desc" : util.format('%s message at offset %d has invalid reason (%d).', message.header.type, offset, reason)
                            });
                    }

                    var desc = port.unpack(buffer, offset + offsets.desc);
                    if ('error' in desc) {
                        return desc;
                    }
                    if ('warnings' in desc) {
                        warnings.concat(desc.warnings);
                    }

                    message.body.desc = desc.port;

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

                    if (buffer.length < offset + ofp.sizes.ofp_port_Sttus) {
                        return {
                            error : { desc : util.format('%s message at offset %d does not fit the buffer.', message.header.type, offset)}
                        }
                    }

                    buffer.writeUInt8(ofp.ofp_type.OFPT_PORT_STATUS, offset + offsetsHeader.type, true);
                    buffer.writeUInt16BE(ofp.sizes.ofp_port_status, offset + offsetsHeader.length, true);

                    if (message.body.reason in ofp.ofp_port_reason) {
                        var reason = ofp.ofp_port_reason[message.body.reason];
                    } else {
                        var reason = 0;
                        warnings.push({desc: util.format('%s message at offset %d has invalid reason (%s).', message.header.type, offset, message.body.reason)});
                    }
                    buffer.writeUInt8(reason, offset + offsets.reason, true);

                    buffer.fill(0, offset + offsets.pad, offset + offsets.pad + 7);

                    var pack = port.pack(message.body.desc, buffer, offset + offsets.desc);

                    if ('error' in pack) {
                        return pack;
                    }
                    if ('warnings' in pack) {
                        warnings.concat(pack.warnings);
                    }

                    if (warnings.length == 0) {
                        return {
                            offset : pack.offset
                        }
                    } else {
                        return {
                            warnings: warnings,
                            offset : pack.offset
                        }
                    }
            }

}

})();
