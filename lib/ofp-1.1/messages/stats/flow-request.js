/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');

require('buffertools');

var ofp = require('../../ofp.js');
var ofputil = require('../../../util.js');

var match = require('../../structs/match.js');

var offsetsHeader = ofp.offsets.ofp_header;
var offsetsStats = ofp.offsets.ofp_stats_request;
var offsets = ofp.offsets.ofp_flow_stats_request;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var stats = {
                            "header" : {"type" : 'OFPST_FLOW'},
                            "body" : {}
                        };
                    var warnings = [];

                    var len = buffer.readUInt16BE(offset + offsetsHeader.length, true);

                    // NOTE: ofp_flow_stats_request contains a standard match structure
                    if (len != ofp.sizes.ofp_stats_request + ofp.sizes.ofp_flow_stats_request) {
                        return {
                            "error" : {
                                "desc" : util.format('%s stats message at offset %d has invalid length (%d).', stats.header.type, offset, len),
                                "type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'
                            }
                        }
                    }


                    stats.body.table_id = buffer.readUInt8(offset + ofp.sizes.ofp_stats_request + offsets.table_id, true);
                    if (stats.body.table_id == ofp.ofp_table.OFPTT_ALL) {
                        stats.body.table_id = 'OFPTT_ALL';
                    }

                    var out_port = buffer.readUInt32BE(offset + ofp.sizes.ofp_stats_request + offsets.out_port, true);
                    if (out_port > ofp.ofp_port_no.OFPP_MAX) {
                        if (out_port != ofp.ofp_port_no.OFPP_ANY) {
                            stats.body.out_port = out_port;
                            warnings.push({
                                        "desc" : util.format('%s stats message at offset %d has invalid out_port (%d).', stats.header.type, offset, out_port),
                                        "type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_STAT'
                                    });
                        }
                    } else {
                        stats.body.out_port = out_port;
                    }

                    var out_group = buffer.readUInt32BE(offset + ofp.sizes.ofp_stats_request + offsets.out_group, true);
                    if (out_group > ofp.ofp_group.OFPG_MAX) {
                        if (out_group != ofp.ofp_group.OFPG_ANY) {
                            stats.body.out_group = out_group;
                            warnings.push({
                                        "desc" : util.format('%s stats message at offset %d has invalid out_port (%d).', stats.header.type, offset, out_port),
                                        "type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_STAT'
                                    });
                        }
                    } else {
                        stats.body.out_group = out_group;
                    }

                    var cookieBuffer = new Buffer(8);

                    // TODO : check if mask is correct
                    buffer.copy(cookieBuffer, 0, offset + ofp.sizes.ofp_stats_request + offsets.cookie_mask, offset + ofp.sizes.ofp_stats_request + offsets.cookie_mask + 8);
                    if (!cookieBuffer.equals(ofputil.UINT64_ALL)) {
                        if (!cookieBuffer.equals(ofputil.UINT64_NONE)) {
                            stats.body.cookie_mask = cookieBuffer;
                        }
                        stats.body.cookie = new Buffer(8);
                        buffer.copy(stats.body.cookie, 0, offset + ofp.sizes.ofp_stats_request + offsets.cookie, offset + ofp.sizes.ofp_stats_request + offsets.cookie + 8);
                    }

                    var unpack = match.unpack(buffer, offset + ofp.sizes.ofp_stats_request + offsets.match);
                    if ('error' in unpack) {
                        return unpack;
                    }
                    if ('warnings' in unpack) {
                        warnings.concat(unpack.warnings);
                    }
                    stats.body.match = unpack.match;

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

