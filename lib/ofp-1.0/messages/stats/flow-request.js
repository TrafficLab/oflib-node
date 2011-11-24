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

                    var unpack = match.unpack(buffer, offset + ofp.sizes.ofp_stats_request + offsets.match);
                    if ('error' in unpack) {
                        return unpack;
                    }
                    if ('warnings' in unpack) {
                        warnings.concat(unpack.warnings);
                    }
                    stats.body.match = unpack.match;

                    stats.body.table_id = buffer.readUInt8(offset + ofp.sizes.ofp_stats_request + offsets.table_id, true);
                    if (stats.body.table_id == ofp.ofp_table.OFPTT_EMERG) {
                        stats.body.table_id = 'OFPTT_EMERG';
                    }
                    if (stats.body.table_id == ofp.ofp_table.OFPTT_ALL) {
                        stats.body.table_id = 'OFPTT_ALL';
                    }

                    var out_port = buffer.readUInt16BE(offset + ofp.sizes.ofp_stats_request + offsets.out_port, true);
                    if (out_port > ofp.ofp_port.OFPP_MAX) {
                        if (out_port != ofp.ofp_port.OFPP_ANY) {
                            stats.body.out_port = out_port;
                            warnings.push({
                                        "desc" : util.format('%s stats message at offset %d has invalid out_port (%d).', stats.header.type, offset, out_port),
                                        "type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_STAT'
                                    });
                        }
                    } else {
                        stats.body.out_port = out_port;
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

