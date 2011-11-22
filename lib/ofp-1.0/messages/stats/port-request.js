/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('../../ofp.js');

var offsetsHeader = ofp.offsets.ofp_header;
var offsetsStats = ofp.offsets.ofp_stats_request;
var offsets = ofp.offsets.ofp_port_stats_request;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var stats = {
                            "header" : {"type" : 'OFPST_PORT'},
                            "body" : {}
                        };
                    var warnings = [];

                    var len = buffer.readUInt16BE(offset + offsetsHeader.length, true);

                    if (len != ofp.sizes.ofp_stats_request + ofp.sizes.ofp_port_stats_request) {
                        return {
                            "error" : {
                                "desc" : util.format('%s stats message at offset %d has invalid length (%d).', stats.header.type, offset, len),
                                "type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'
                            }
                        }
                    }

                    var port = buffer.readUInt16BE(offset + ofp.sizes.ofp_stats_request + offsets.port_no, true);
                    if (port > ofp.ofp_port.OFPP_MAX) {
                        if (port != ofp.ofp_port.OFPP_ANY) {
                            stats.body.port_no = port;
                            warnings.push({
                                    "desc" : util.format('%s stats message at offset %d has invalid port (%d).', stats.header.type, offset, port),
                                    "type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_STAT'
                            });
                        }
                    } else {
                        stats.body.port_no = port;
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
