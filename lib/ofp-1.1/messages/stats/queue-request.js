/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('../../ofp.js');

var offsetsHeader = ofp.offsets.ofp_header;
var offsetsStats = ofp.offsets.ofp_stats_request;
var offsets = ofp.offsets.ofp_queue_stats_request;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var stats = {
                            "header" : {"type" : 'OFPST_QUEUE'},
                            "body" : {}
                        };
                    var warnings = [];

                    var len = buffer.readUInt16BE(offset + offsetsHeader.length, true);

                    if (len != ofp.sizes.ofp_stats_request + ofp.sizes.ofp_queue_stats_request) {
                        return {
                            "error" : {
                                "desc" : util.format('%s stats message at offset %d has invalid length (%d).', stats.header.type, offset, len),
                                "type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'
                            }
                        }
                    }

                    var port = buffer.readUInt32BE(offset + ofp.sizes.ofp_stats_request + offsets.port_no, true);
                    if (port > ofp.ofp_port_no.OFPP_MAX) {
                        if (port != ofp.ofp_port_no.OFPP_ANY) {
                            stats.body.port_no = port;
                            warnings.push({
                                    "desc" : util.format('%s stats message at offset %d has invalid port (%d).', stats.header.type, offset, port),
                                    "type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_STAT'
                            });
                        }
                    } else {
                        stats.body.port_no = port;
                    }

                    var queue_id = buffer.readUInt32BE(offset + ofp.sizes.ofp_stats_request + offsets.queue_id, true);
                    if (queue_id != ofp.OFPQ_ALL) {
                        stats.body.queue_id = queue_id;
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
            },

            "pack" : function(stats, buffer, offset) {
                    var warnings = [];

                    if (buffer.length < offset + ofp.sizes.ofp_stats_request + ofp.sizes.ofp_aggregate_stats_request) {
                        return {
                            error : { desc : util.format('%s statistics message at offset %d does not fit the buffer.', stats.header.type, offset)}
                        }
                    }

                    // TODO validate
                    if ('port_no' in stats.body) {
                        var port_no = stats.body.port_no;
                    } else {
                        var port_no = ofp.ofp_port_no.OFPP_ALL;
                    }
                    buffer.writeUInt32BE(port_no, offset + ofp.sizes.ofp_stats_request + offsets.port_no);

                    // TODO validate
                    if ('queue_id' in stats.body) {
                        var queue_id = stats.body.queue_id;
                    } else {
                        var queue_id = ofp.OFPQ_ALL;
                    }
                    buffer.writeUInt32BE(queue_id, offset + ofp.sizes.ofp_stats_request + offsets.queue_id);

                    if (warnings.length == 0) {
                        return {
                            offset : offset + ofp.sizes.ofp_stats_request + ofp.sizes.ofp_group_stats_request
                        }
                    } else {
                        return {
                            warnings: warnings,
                            offset : offset + ofp.sizes.ofp_stats_request + ofp.sizes.ofp_group_stats_request
                        }
                    }
        }

}

})();
