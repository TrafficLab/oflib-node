/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var Int64 = require('node-int64');

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

                    tableStats.max_entries = buffer.readUInt32BE(offset + offsets.max_entries, true);

                    tableStats.active_count = buffer.readUInt32BE(offset + offsets.active_count, true);

                    tableStats.lookup_count = new Int64(buffer.readUInt32BE(offset + offsets.lookup_count, true),
                                                        buffer.readUInt32BE(offset + offsets.lookup_count + 4, true));

                    tableStats.matched_count = new Int64(buffer.readUInt32BE(offset + offsets.matched_count, true),
                                                         buffer.readUInt32BE(offset + offsets.matched_count + 4, true));

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
