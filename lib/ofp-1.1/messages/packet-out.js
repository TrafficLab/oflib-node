/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('../ofp.js');
var ofputil = require('../../util.js');

var action = require('../action.js');

var offsetsHeader = ofp.offsets.ofp_header;
var offsets = ofp.offsets.ofp_packet_out;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var message = {
                            "header" : {"type" : 'OFPT_PACKET_OUT'},
                            "body" : {}
                        };
                    var warnings = [];

                    var len = buffer.readUInt16BE(offset + offsetsHeader.length, true);

                    if (len < ofp.sizes.ofp_packet_out) {
                        return {
                            "error" : {
                                "desc" : util.format('%s message at offset %d has invalid length (%d).', message.header.type, offset, len),
                                "type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'
                            }
                        }
                    }

                    ofputil.setIfNotEq(message.body, 'buffer_id', buffer.readUInt32BE(offset + offsets.buffer_id, true), 0xffffffff);

                    var in_port = buffer.readUInt32BE(offset + offsets.in_port, true);
                    if (in_port > ofp.ofp_port_no.OFPP_MAX) {
                        if (in_port == ofp.ofp_port_no.OFPP_CONTROLLER) {
                            message.body.in_port = 'OFPP_CONTROLLER';
                        } else {
                            message.body.in_port = in_port;
                            warnings.push({
                                        "desc" : util.format('%s message at offset %d has invalid in_port (%d).', message.header.type, offset, in_port),
                                        "type" : 'OFPBAC_BAD_ACTION', "code" : 'OFPBAC_BAD_ARGUMENT'
                            });
                        }
                    } else {
                        message.body.in_port = in_port;
                    }

                    message.body.actions = [];

                    var actionsLen = buffer.readUInt16BE(offset + offsets.actions_len, true);
                    var actionsEnd = offset + ofp.sizes.ofp_packet_out + actionsLen;

                    var pos = offset + offsets.actions;

                    while (pos < actionsEnd) {
                        var unpack = action.unpack(buffer, pos);
                        if ('error' in unpack) {
                            return unpack;
                        }
                        if ('warnings' in unpack) {
                            warnings.concat(unpack.warnings);
                        }
                        message.body.actions.push(unpack.action);
                        pos = unpack.offset;
                    }

                    if (pos != actionsEnd) {
                        return {
                            "error" : {
                                "desc" : util.format('%s message at offset %d has extra bytes (%d).', message.header.type, offset, (pos - len)),
                                "type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'
                            }
                        }
                    }

                    var dataLen = len - actionsLen - ofp.sizes.ofp_packet_out;

                    if (dataLen > 0) {
                        if ('buffer_id' in message.body) {
                            warnings.push({
                                    "desc" : util.format('%s message at offset %d has both buffer_id and data.', message.header.type, offset),
                                    "type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BUFFER_UNKNOWN'
                            });
                        } else {
                            message.body.data = new Buffer(dataLen);
                            buffer.copy(message.body.data, 0, actionsEnd, actionsEnd + dataLen);
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

                    if (buffer.length < offset + ofp.sizes.ofp_packet_out) {
                        return {
                            error : { desc : util.format('%s message at offset %d does not fit the buffer.', message.header.type, offset)}
                        }
                    }

                    buffer.writeUInt8(ofp.ofp_type.OFPT_PACKET_OUT, offset + offsetsHeader.type, true);

                    //TODO: validate
                    if ('buffer_id' in message.body) {
                        var buffer_id = message.body.buffer_id;
                    } else {
                        var buffer_id = 0xffffffff;
                    }
                    buffer.writeUInt32BE(buffer_id, offset + offsets.buffer_id, true);

                    //TODO: validate
                    buffer.writeUInt32BE(message.body.in_port, offset + offsets.in_port, true);

                    buffer.fill(0, offset + offsets.pad, offset + offsets.pad + 6);

                    var pos = offset + offsets.actions;
                    message.body.actions.forEach(function(act) {
                        var pack = action.pack(act, buffer, pos);

                        if ('error' in pack) {
                            return pack;
                        }
                        if ('warnings' in pack) {
                            warnings.concat(pack.warnings);
                        }

                        pos = pack.offset;
                    });

                    var actions_len = pos - (offset + offsets.actions);
                    buffer.writeUInt16BE(actions_len, offset + offsets.actions_len, true);

                    if ('data' in message.body) {
                        message.body.data.copy(buffer, pos);
                        pos += message.body.data.length;
                    }

                    buffer.writeUInt16BE(pos, offset + offsetsHeader.length, true);

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
