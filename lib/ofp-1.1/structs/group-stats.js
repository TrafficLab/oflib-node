/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');

var ofp = require('../ofp.js');
var ofputil = require('../../util.js');
var bucketCounter = require('../structs/bucket-counter.js');

var offsets = ofp.offsets.ofp_group_stats;

module.exports = {
            "struct" : 'group-stats',

            "unpack" : function(buffer, offset) {
                    var groupStats = {};
                    var warnings = [];

                    if (buffer.length < offset + ofp.sizes.ofp_group_stats) {
                        return {
                            "error" : {
                                "desc" : util.format('group-stats at offset %d has invalid length (%d).', offset, (buffer.length - offset))
                            }
                        }
                    }

                    var len = buffer.readUInt16BE(offset + offsets.length, true);

                    if (len < ofp.sizes.ofp_group_stats) {
                        return {
                            "error" : {
                                "desc" : util.format('group-stats at offset %d has invalid length (%d).', offset, len),
                            }
                        }
                    }


                    groupStats.group_id = buffer.readUInt32BE(offset + offsets.group_id, true);
                    if (groupStats.group_id > ofp.ofp_group.OFPG_MAX) {
                        warnings.push({"desc" : util.format('group-stats at offset %d has invalid group_id (%d).', offset, groupStats.group_id)});
                    }

                    groupStats.ref_count = buffer.readUInt32BE(offset + offsets.ref_count, true);

                    groupStats.packet_count = [buffer.readUInt32BE(offset + offsets.packet_count, true),
                                               buffer.readUInt32BE(offset + offsets.packet_count + 4, true)];

                    groupStats.byte_count = [buffer.readUInt32BE(offset + offsets.byte_count, true),
                                             buffer.readUInt32BE(offset + offsets.byte_count + 4, true)];


                    groupStats.bucket_stats = [];

                    var pos = offset + offsets.bucket_stats;
                    while (pos < offset + len) {
                        var unpack = bucketCounter.unpack(buffer, pos);
                        if ('error' in unpack) {
                            return unpack;
                        }

                        if ('warnings' in unpack) {
                            warnings.concat(unpack.warnings);
                        }

                        groupStats.bucket_stats.push(unpack['bucket-counter']);
                        pos = unpack.offset;
                    }

                    if (pos != offset + len) {
                        return {
                            "error" : {
                                "desc" : util.format('group-stats at offset %d has extra bytes (%d).', offset, (pos - len)),
                            }
                        }
                    }

                    if (warnings.length == 0) {
                        return {
                            "group-stats" : groupStats,
                            "offset" : offset + len
                        }
                    } else {
                        return {
                            "group-stats" : groupStats,
                            "warnings" : warnings,
                            "offset" : offset + len
                        }
                    }
            },

            "pack" : function(groupStats, buffer, offset) {
                    var warnings = [];

                    if (buffer.length < offset + ofp.sizes.ofp_group_stats) {
                        return {
                            "error" : {
                                "desc" : util.format('group-stats at offset %d has invalid length (%d).', offset, (buffer.length - offset))
                            }
                        }
                    }

                    buffer.fill(0, offset + offsets.pad, offset + offsets.pad + 2);

                    buffer.writeUInt32BE(groupStats.group_id, offset + offsets.group_id, true);
                    if (groupStats.group_id > ofp.ofp_group.OFPG_MAX) {
                        warnings.push({"desc" : util.format('group-stats at offset %d has invalid group_id (%d).', offset, groupStats.group_id)});
                    }

                    buffer.writeUInt32BE(groupStats.ref_count, offset + offsets.ref_count, true);

                    buffer.fill(0, offset + offsets.pad2, offset + offsets.pad2 + 4);

                    buffer.writeUInt32BE(groupStats.packet_count[0], offset + offsets.packet_count, true);
                    buffer.writeUInt32BE(groupStats.packet_count[1], offset + offsets.packet_count + 4, true);

                    buffer.writeUInt32BE(groupStats.byte_count[0], offset + offsets.byte_count, true);
                    buffer.writeUInt32BE(groupStats.byte_count[1], offset + offsets.byte_count + 4, true);

                    var pos = offset + offsets.bucket_stats;
                    groupStats.bucket_stats.forEach(function(stat) {
                        var pack = bucketCounter.pack(stat, buffer, pos);

                        if ('error' in pack) {
                            return pack;
                        }
                        if ('warnings' in pack) {
                            warnings.concat(pack.warnings);
                        }

                        pos = pack.offset;
                    });

                    buffer.writeUInt16BE(pos - offset, offset + offsets.length, true);

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
