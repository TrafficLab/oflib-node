/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var Int64 = require('node-int64');

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

                    stats.body.packet_count = new Int64(buffer.readUInt32BE(offset + ofp.sizes.ofp_stats_reply + offsets.packet_count, true),
                                                        buffer.readUInt32BE(offset + ofp.sizes.ofp_stats_reply + offsets.packet_count + 4, true));

                    stats.body.byte_count = new Int64(buffer.readUInt32BE(offset + ofp.sizes.ofp_stats_reply + offsets.byte_count, true),
                                                      buffer.readUInt32BE(offset + ofp.sizes.ofp_stats_reply + offsets.byte_count + 4, true));

                    stats.body.flow_count = buffer.readUInt32BE(offset + ofp.sizes.ofp_stats_reply + offsets.flow_count, true);

                    return {
                        "stats" : stats,
                        "offset" : offset + len
                    }
            }

}

})();
