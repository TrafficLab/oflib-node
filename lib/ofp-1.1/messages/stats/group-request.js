/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('../../ofp.js');

var offsetsHeader = ofp.offsets.ofp_header;
var offsetsStats = ofp.offsets.ofp_stats_request;
var offsets = ofp.offsets.ofp_group_stats_request;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var stats = {
                            "header" : {"type" : 'OFPST_GROUP'},
                            "body" : {}
                        };
                    var warnings = [];

                    var len = buffer.readUInt16BE(offset + offsetsHeader.length, true);

                    if (len != ofp.sizes.ofp_stats_request + ofp.sizes.ofp_group_stats_request) {
                        return {
                            "error" : {
                                "desc" : util.format('%s stats message at offset %d has invalid length (%d).', stats.header.type, offset, len),
                                "type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'
                            }
                        }
                    }

                    var group_id = buffer.readUInt32BE(offset + ofp.sizes.ofp_stats_request + offsets.group_id, true);
                    if (group_id > ofp.ofp_group.OFPG_MAX) {
                        if (group_id != ofp.ofp_group.OFPG_ANY) {
                            stats.body.group_id = group_id;
                            warnings.push({
                                    "desc" : util.format('%s stats message at offset %d has invalid group_id (%d).', stats.header.type, offset, group_id),
                                    "type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_STAT'
                            });
                        }
                    } else {
                        stats.body.group_id = group_id;
                    }

                    if (warnings.length = 0) {
                        return {
                            "stats" : stats,
                            "offset" : offset + len
                        }
                    } else {
                        return {
                            "stats" : stats,
                            "warnings" : warnings,
                            "offset" : offset + len
                        }
                    }
            }

}

})();
