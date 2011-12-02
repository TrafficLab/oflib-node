/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');

var ofp = require('../../ofp.js');
var ofputil = require('../../../util.js');

var match = require('../../structs/match.js');

var offsetsHeader = ofp.offsets.ofp_header;
var offsetsStats = ofp.offsets.ofp_stats_reply;
var offsets = ofp.offsets.ofp_aggregate_stats_reply;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var stats = {
                            "header" : {"type" : 'OFPST_AGGREGATE'},
                            "body" : {}
                        };

                    var len = buffer.readUInt16BE(offset + offsetsHeader.length, true);

                    if (len != ofp.sizes.ofp_stats_reply + ofp.sizes.ofp_aggregate_stats_reply) {
                        return {
                            "error" : {
                                "desc" : util.format('%s stats message at offset %d has invalid length (%d).', stats.header.type, offset, len)
                            }
                        }
                    }

                    stats.body.packet_count = [buffer.readUInt32BE(offset + ofp.sizes.ofp_stats_reply + offsets.packet_count, true),
                                               buffer.readUInt32BE(offset + ofp.sizes.ofp_stats_reply + offsets.packet_count + 4, true)];

                    stats.body.byte_count = [buffer.readUInt32BE(offset + ofp.sizes.ofp_stats_reply + offsets.byte_count, true),
                                             buffer.readUInt32BE(offset + ofp.sizes.ofp_stats_reply + offsets.byte_count + 4, true)];

                    stats.body.flow_count = buffer.readUInt32BE(offset + ofp.sizes.ofp_stats_reply + offsets.flow_count, true);

                    return {
                        "stats" : stats,
                        "offset" : offset + len
                    }
            },

            "pack" : function(stats, buffer, offset) {
                    var warnings = [];

                    if (buffer.length < offset + ofp.sizes.ofp_stats_reply + ofp.sizes.ofp_aggregate_stats_reply) {
                        return {
                            error : { desc : util.format('%s statistics message at offset %d does not fit the buffer.', stats.header.type, offset)}
                        }
                    }

                    buffer.writeUInt32BE(stats.body.packet_count[0], offset + ofp.sizes.ofp_stats_reply + offsets.packet_count, true);
                    buffer.writeUInt32BE(stats.body.packet_count[1], offset + ofp.sizes.ofp_stats_reply + offsets.packet_count + 4, true);

                    buffer.writeUInt32BE(stats.body.byte_count[0], offset + ofp.sizes.ofp_stats_reply + offsets.byte_count, true);
                    buffer.writeUInt32BE(stats.body.byte_count[1], offset + ofp.sizes.ofp_stats_reply + offsets.byte_count + 4, true);

                    buffer.writeUInt32BE(stats.body.flow_count, offset + ofp.sizes.ofp_stats_reply + offsets.flow_count, true);
                    buffer.fill(0, offset + ofp.sizes.ofp_stats_reply + offsets.pad, offset + ofp.sizes.ofp_stats_reply + offsets.pad + 4);

                    if (warnings.length == 0) {
                        return {
                            offset : offset + ofp.sizes.ofp_stats_reply + ofp.sizes.ofp_aggregate_stats_reply
                        }
                    } else {
                        return {
                            warnings: warnings,
                            offset : offset + ofp.sizes.ofp_stats_reply + ofp.sizes.ofp_aggregate_stats_reply
                        }
                    }
        }


}

})();
