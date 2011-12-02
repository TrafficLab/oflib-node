/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');

var ofp = require('../ofp.js');
var ofputil = require('../../util.js');

var match = require('../structs/match.js');

var offsetsHeader = ofp.offsets.ofp_header;
var offsets = ofp.offsets.ofp_flow_removed;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var message = {
                            "header" : {"type" : 'OFPT_FLOW_REMOVED'},
                            "body" : {}
                        };
                    var warnings = [];

                    var len = buffer.readUInt16BE(offset + offsetsHeader.length, true);

                    if (len < ofp.sizes.ofp_flow_removed) {
                        return {
                            "error" : {
                                "desc" : util.format('%s message at offset %d has invalid length (%d).', message.header.type, offset, len)
                            }
                        }
                    }

                    message.body.cookie = new Buffer(8);
                    buffer.copy(message.body.cookie, 0, offset + offsets.cookie, offset + offsets.cookie + 8);

                    message.body.priority = buffer.readUInt16BE(offset + offsets.priority, true);

                    var reason = buffer.readUInt8(offset + offsets.reason, true)
                    if (!ofputil.setEnum(message.body, 'reason', reason, ofp.ofp_flow_removed_reason_rev)) {
                        message.body.reason = reason;
                        warnings.push({"desc" : util.format('%s message at offset %d has invalid reason (%d).', message.header.type, offset, reason)});
                    }

                    message.body.table_id = buffer.readUInt8(offset + offsets.table_id);
                    if (message.body.table_id > ofp.ofp_table.OFPTT_MAX) {
                        warnings.push({"desc" : util.format('%s message at offset %d has invalid table_id (%d).', message.header.type, offset, table_id)});
                    }

                    message.body.duration_sec = buffer.readUInt32BE(offset + offsets.duration_sec);
                    message.body.duration_nsec = buffer.readUInt32BE(offset + offsets.duration_nsec);

                    ofputil.setIfNotEq(message.body, 'idle_timeout', buffer.readUInt16BE(offset + offsets.idle_timeout, true), 0);

                    message.body.packet_count = [buffer.readUInt32BE(offset + offsets.packet_count, true),
                                                 buffer.readUInt32BE(offset + offsets.packet_count + 4, true)];


                    message.body.byte_count = [buffer.readUInt32BE(offset + offsets.byte_count, true),
                                               buffer.readUInt32BE(offset + offsets.byte_count + 4, true)];

                    // NOTE: ofp_flow_mod does contain a standard match structure!
                    var unpack = match.unpack(buffer, offset + offsets.match);
                    if ('error' in unpack) {
                        return unpack;
                    }
                    if ('warnings' in unpack) {
                        warnings.concat(unpack.warnings);
                    }
                    message.body.match = unpack.match;

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

                    if (buffer.length < offset + ofp.sizes.ofp_flow_removed) {
                        return {
                            error : { desc : util.format('%s message at offset %d does not fit the buffer.', message.header.type, offset)}
                        }
                    }

                    buffer.writeUInt8(ofp.ofp_type.OFPT_FLOW_REMOVED, offset + offsetsHeader.type, true);

                    message.body.cookie.copy(buffer, offset + offsets.cookie);
                    buffer.writeUInt16BE(message.body.priority, offset + offsets.priority, true);

                    // TODO: validate
                    if (message.body.reason in ofp.ofp_flow_removed_reason) {
                        var reason = ofp.ofp_flow_removed_reason[message.body.reason];
                    } else {
                        var reason = 0;
                        warnings.push({desc : util.format('%s message at offset %d does not fit the buffer.', message.header.type, offset)});
                    }
                    buffer.writeUInt8(reason, offset + offsets.reason, true);

                    //TODO: validate
                    buffer.writeUInt8(message.body.table_id, offset + offsets.table_id, true);
                    buffer.writeUInt32BE(message.body.duration_sec, offset + offsets.duration_sec, true);
                    buffer.writeUInt32BE(message.body.duration_nsec, offset + offsets.duration_nsec, true);
                    buffer.writeUInt16BE(message.body.idle_timeout, offset + offsets.idle_timeout, true);

                    buffer.fill(0, offset + offsets.pad2, offset + offsets.pad2 + 2);

                    buffer.writeUInt32BE(message.body.packet_count[0], offset + offsets.packet_count, true);
                    buffer.writeUInt32BE(message.body.packet_count[1], offset + offsets.packet_count + 4, true);

                    buffer.writeUInt32BE(message.body.byte_count[0], offset + offsets.byte_count, true);
                    buffer.writeUInt32BE(message.body.byte_count[1], offset + offsets.byte_count + 4, true);

                    var pack = match.pack(message.body.match, buffer, offset + offsets.match);
                    if ('error' in pack) {
                        return pack;
                    }
                    if ('warnings' in pack) {
                        warnings.concat(pack.warnings);
                    }

                    buffer.writeUInt16BE(pack.offset, offset + offsetsHeader.length, true);

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
