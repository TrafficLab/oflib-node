/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');

var ofp = require('../ofp.js');
var ofputil = require('../../util.js');

var offsets = ofp.offsets.ofp_table_stats;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var tableStats = {};
                    var warnings = [];

                    if (buffer.length < ofp.sizes.ofp_table_stats) {
                        return {
                            "error" : {
                                "desc" : util.format('table-stats at offset %d has invalid length (%d).', offset, len)
                            }
                        }
                    }

                    tableStats.table_id = buffer.readUInt8(offset + offsets.table_id, true);
                    if (tableStats.table_id > ofp.ofp_table.OFPTT_MAX) {
                        warnings.push({"desc" : util.format('table_stats at offset %d has invalid table_id (%d).', offset, tableStats.table_id)});
                    }

                    tableStats.name = buffer.toString('utf8', offset + offsets.name, offset + offsets.name + ofp.OFP_MAX_TABLE_NAME_LEN);
                    tableStats.name = tableStats.name.substr(0, tableStats.name.indexOf('\0'));

                    var wildcards = buffer.readUInt32BE(offset + offsets.wildcards, true);
                    var wildcardsParsed = ofputil.parseFlags(wildcards, ofp.ofp_flow_wildcards);
                    tableStats.wildcards = wildcardsParsed.array;
                    if (wildcardsParsed.remain != 0) {
                        warnings.push({"desc" : util.format('table-stats at offset %d has invalid wildcards (%d).', offset, wildcards)});
                    }

                    var match = buffer.readUInt32BE(offset + offsets.match, true);
                    var matchParsed = ofputil.parseFlags(match, ofp.ofp_flow_match_fields);
                    tableStats.match = matchParsed.array;
                    if (matchParsed.remain != 0) {
                        warnings.push({"desc" : util.format('table-stats at offset %d has invalid match (%d).', offset, match)});
                    }

                    var instructions = buffer.readUInt32BE(offset + offsets.instructions, true);
                    var instructionsParsed = ofputil.parseFlags(instructions, ofp.ofp_instruction_type_flags);
                    tableStats.instructions = instructionsParsed.array;
                    if (instructionsParsed.remain != 0) {
                        warnings.push({"desc" : util.format('table-stats at offset %d has invalid instructions (%d).', offset, instructions)});
                    }

                    var write_actions = buffer.readUInt32BE(offset + offsets.write_actions, true);
                    var write_actionsParsed = ofputil.parseFlags(write_actions, ofp.ofp_action_type_flags);
                    tableStats.write_actions = write_actionsParsed.array;
                    if (write_actionsParsed.remain != 0) {
                        warnings.push({"desc" : util.format('table-stats at offset %d has invalid write_actions (%d).', offset, write_actions)});
                    }

                    var apply_actions = buffer.readUInt32BE(offset + offsets.apply_actions, true);
                    var apply_actionsParsed = ofputil.parseFlags(apply_actions, ofp.ofp_action_type_flags);
                    tableStats.apply_actions = apply_actionsParsed.array;
                    if (apply_actionsParsed.remain != 0) {
                        warnings.push({"desc" : util.format('table-stats at offset %d has invalid apply_actions (%d).', offset, apply_actions)});
                    }

                    var config = buffer.readUInt32BE(offset + offsets.config, true);

                    switch (config & ofp.ofp_table_config.OFPTC_TABLE_MISS_MASK) {
                        case ofp.ofp_table_config.OFPTC_TABLE_MISS_CONTROLLER: {
                            tableStats.config = 'OFPTC_TABLE_MISS_CONTROLLER';
                            break;
                        }
                        case ofp.ofp_table_config.OFPTC_TABLE_MISS_CONTINUE: {
                            tableStats.config = 'OFPTC_TABLE_MISS_CONTINUE';
                            break;
                        }
                        case ofp.ofp_table_config.OFPTC_TABLE_MISS_DROP: {
                            tableStats.config = 'OFPTC_TABLE_MISS_DROP';
                            break;
                        }
                        default: {
                            tableStats.config = config;
                            warnings.push({
                                    "desc" : util.format('table-stats at offset %d has invalid config (%d).', offset, config)
                                });
                        }
                    }

                    if (config > ofp.ofp_table_config.OFPTC_TABLE_MISS_MASK) {
                        warnings.push({
                                "desc" : util.format('table-stats at offset %d has invalid config (%d).', offset, config)
                            });
                    }

                    tableStats.max_entries = buffer.readUInt32BE(offset + offsets.max_entries, true);

                    tableStats.active_count = buffer.readUInt32BE(offset + offsets.active_count, true);

                    tableStats.lookup_count = [buffer.readUInt32BE(offset + offsets.lookup_count, true),
                                                        buffer.readUInt32BE(offset + offsets.lookup_count + 4, true)];

                    tableStats.matched_count = [buffer.readUInt32BE(offset + offsets.matched_count, true),
                                                         buffer.readUInt32BE(offset + offsets.matched_count + 4, true)];

                    if (warnings.length == 0) {
                        return {
                            "table-stats" : tableStats,
                            "offset" : offset + ofp.sizes.ofp_table_stats
                        };
                    } else {
                        return {
                            "table-stats" : tableStats,
                            "warnings" : warnings,
                            "offset" : offset + ofp.sizes.ofp_table_stats
                        };
                    }
            }

}

})();
