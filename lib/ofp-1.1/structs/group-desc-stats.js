/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');

var ofp = require('../ofp.js');
var ofputil = require('../../util.js');
var bucket = require('../structs/bucket.js');

var offsets = ofp.offsets.ofp_group_desc_stats;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var groupDescStats = {};
                    var warnings = [];

                    if (buffer.length < offset + ofp.sizes.ofp_group_desc_stats) {
                        return {
                            "error" : {
                                "desc" : util.format('group-desc-stats at offset %d has invalid length (%d).', offset, (buffer.length - offset))
                            }
                        }
                    }

                    var len = buffer.readUInt16BE(offset + offsets.length, true);

                    if (len < ofp.sizes.ofp_group_stats) {
                        return {
                            "error" : {
                                "desc" : util.format('group-desc-stats at offset %d has invalid length (%d).', offset, len),
                            }
                        }
                    }

                    // TODO: Experimenter
                    if (!ofputil.setEnum(groupDescStats, 'type', buffer.readUInt8(offset + offsets.type, true), ofp.ofp_group_type_rev)) {
                        return {
                            "error" : util.format('group-desc-stats at offset %d has invalid type (%d).', offset, buffer.readUInt8(offset, offsets.type, true))
                        }
                    }

                    groupDescStats.group_id = buffer.readUInt32BE(offset + offsets.group_id, true);
                    if (groupDescStats.group_id > ofp.ofp_group.OFPG_MAX) {
                        warnings.push({"desc" : util.format('group-desc-stats at offset %d has invalid group_id (%d).', offset, groupDescStats.group_id)});
                    }


                    groupDescStats.buckets = [];

                    var pos = offset + offsets.buckets;
                    while (pos < offset + len) {
                        var unpack = bucket.unpack(buffer, pos);
                        if ('error' in unpack) {
                            return unpack;
                        }

                        if ('warnings' in unpack) {
                            warnings.concat(unpack.warnings);
                        }

                        groupDescStats.buckets.push(unpack.bucket);
                        pos = unpack.offset;
                    }

                    if (pos != offset + len) {
                        return {
                            "error" : {
                                "desc" : util.format('group-desc-stats at offset %d has extra bytes (%d).', offset, (pos - len)),
                            }
                        }
                    }

                    if (warnings.length == 0) {
                        return {
                            "group-desc-stats" : groupDescStats,
                            "offset" : offset + len
                        }
                    } else {
                        return {
                            "group-desc-stats" : groupDescStats,
                            "warnings" : warnings,
                            "offset" : offset + len
                        }
                    }
            }
}

})();
