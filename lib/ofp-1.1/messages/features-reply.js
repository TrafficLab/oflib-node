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
var offsets = ofp.offsets.ofp_switch_features;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var message = {
                            "header" : {"type" : 'OFPT_FEATURES_REPLY'},
                            "body" : {}
                        };
                    var warnings = [];

                    var len = buffer.readUInt16BE(offset + offsetsHeader.length, true);

                    if (len < ofp.sizes.ofp_switch_features) {
                        return {
                            "error" : {
                                "desc" : util.format('%s message at offset %d has invalid length (%d).', message.header.type, offset, len)
                            }
                        }
                    }

                    message.body.datapath_id = buffer.toString('hex', offset + offsets.datapath_id, offset + offsets.datapath_id + 8);
                    message.body.n_buffers = buffer.readUInt32BE(offset + offsets.n_buffers, true);
                    message.body.n_tables = buffer.readUInt8(offset + offsets.n_tables, true);

                    var capabilities = buffer.readUInt32BE(offset + offsets.capabilities, true);
                    var capabilitiesParsed = ofputil.parseFlags(capabilities, ofp.ofp_capabilities);
                    if (capabilitiesParsed.remain != 0) {
                        warnings.push({"desc" : util.format('%s message at offset %d has invalid capabilities (%d).', message.header.type,  offset, capabilities)});
                    }
                    message.body.capabilities = capabilitiesParsed.array;

                    message.body.ports = [];

                    var pos = offset + offsets.ports;
                    while (pos < offset + len) {
                        var unpack = port.unpack(buffer, pos);
                        if ('error' in unpack) {
                            return unpack;
                        }

                        if ('warnings' in unpack) {
                            warnings.concat(unpack.warnings);
                        }
                        message.body.ports.push(unpack.port);
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

                    if (buffer.length < offset + ofp.sizes.ofp_switch_features) {
                        return {
                            error : { desc : util.format('%s message at offset %d does not fit the buffer.', message.header.type, offset)}
                        }
                    }

                    buffer.writeUInt8(ofp.ofp_type.OFPT_FEATURES_REPLY, offset + offsetsHeader.type, true);

                    buffer.write(message.body.datapath_id, offset + offsets.datapath_id, 8, 'hex');

                    buffer.writeUInt32BE(message.body.n_buffers, offset + offsets.n_buffers, true);
                    buffer.writeUInt8(message.body.n_tables, offset + offsets.n_tables, true);
                    buffer.fill(0, offset + offsets.pad, offset + offsets.pad + 3);

                    var capabilities = 0;
                    message.body.capabilities.forEach(function(flag) {
                        if (flag in ofp.ofp_capabilities) {
                            capabilities |= ofp.ofp_capabilities[flag];
                        } else {
                            warnings.push({desc: util.formt('%s message at offset %d hs invalid capabilities flag (%s).', message.header.type, offset, flag)});
                        }
                    });
                    buffer.writeUInt32BE(capabilities, offset + offsets.capabilities, true);
                    buffer.fill(0, offset + offsets.reserved, offset + offsets.reserved + 4);


                    var pos = offset + offsets.ports;
                    message.body.ports.forEach(function(p) {
                        var pack = port.pack(p, buffer, pos);

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
