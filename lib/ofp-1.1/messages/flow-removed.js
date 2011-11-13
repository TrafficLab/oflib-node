/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var Int64 = require('node-int64');

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

                    message.body.packet_count = new Int64(buffer.readUInt32BE(offset + offsets.packet_count, true),
                                                          buffer.readUInt32BE(offset + offsets.packet_count + 4, true));


                    message.body.byte_count = new Int64(buffer.readUInt32BE(offset + offsets.byte_count, true),
                                                        buffer.readUInt32BE(offset + offsets.byte_count + 4, true));

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
            }

}

})();
