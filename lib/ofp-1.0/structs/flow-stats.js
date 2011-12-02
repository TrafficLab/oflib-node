/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('../ofp.js');
var ofputil = require('../../util.js');
var match = require('../structs/match.js');
var action = require('../action.js');

var offsets = ofp.offsets.ofp_flow_stats;

module.exports = {
            "struct" : 'flow-stats',

            "unpack" : function(buffer, offset) {
                    var flowStats = {};
                    var warnings = [];

                    if (buffer.length < offset + ofp.sizes.ofp_flow_stats) {
                        return {
                            "error" : {
                                "desc" : util.format('flow-stats at offset %d has invalid length (%d).', offset, (buffer.length - offset))
                            }
                        }
                    }

                    var len = buffer.readUInt16BE(offset + offsets.length, true);
                    // NOTE: ofp_flow_stats contains a whole standard match structure
                    if (len < ofp.sizes.ofp_flow_stats) {
                        return {
                            "error" : {
                                "desc" : util.format('flow-stats at offset %d has invalid length (%d).', offset, len),
                            }
                        }
                    }

                    flowStats.table_id = buffer.readUInt8(offset + offsets.table_id);
                    if (flowStats.table_id > ofp.ofp_table.OFPTT_MAX) {
                        warnings.push({"desc" : util.format('flow-stats at offset %d has invalid table_id (%d).', offset, flowStats.table_id)});
                    }

                    var unpack = match.unpack(buffer, offset + offsets.match);
                    if ('error' in unpack) {
                        return unpack;
                    }
                    if ('warnings' in unpack) {
                        warnings.concat(unpack.warnings);
                    }
                    flowStats.match = unpack.match;

                    flowStats.duration_sec = buffer.readUInt32BE(offset + offsets.duration_sec, true);
                    flowStats.duration_nsec = buffer.readUInt32BE(offset + offsets.duration_nsec, true);

                    flowStats.priority = buffer.readUInt16BE(offset + offsets.priority, true);

                    ofputil.setIfNotEq(flowStats, "idle_timeout", buffer.readUInt16BE(offset + offsets.idle_timeout, true), 0);
                    ofputil.setIfNotEq(flowStats, "hard_timeout", buffer.readUInt16BE(offset + offsets.hard_timeout, true), 0);

                    flowStats.cookie = new Buffer(8);
                    buffer.copy(flowStats.cookie, 0, offset + offsets.cookie, offset + offsets.cookie + 8);

                    flowStats.packet_count = [buffer.readUInt32BE(offset + offsets.packet_count, true),
                                              buffer.readUInt32BE(offset + offsets.packet_count + 4, true)];

                    flowStats.byte_count = [buffer.readUInt32BE(offset + offsets.byte_count, true),
                                            buffer.readUInt32BE(offset + offsets.byte_count+ 4, true)];



                    flowStats.actions = [];

                    // NOTE: ofp_flow_stats contains a whole standard match structure
                    var pos = offset + offsets.actions;
                    while (pos < offset + len) {
                        var act = action.unpack(buffer, pos);
                        if ('error' in act) {
                            return act;
                        }

                        if ('warnings' in act) {
                            warnings.concat(act.warnings);
                        }
                        flowStats.actions.push(act.action);
                        pos = act.offset;
                    }

                    if (pos != offset + len) {
                        return {
                            "error" : {
                                "desc" : util.format('flow-stats at offset %d has extra bytes (%d).', offset, (pos - len)),
                            }
                        }
                    }

                    if (warnings.length == 0) {
                        return {
                            "flow-stats" : flowStats,
                            "offset" : offset + len
                        }
                    } else {
                        return {
                            "flow-stats" : flowStats,
                            "warnings" : warnings,
                            "offset" : offset + len
                        }
                    }
            }
}

})();
