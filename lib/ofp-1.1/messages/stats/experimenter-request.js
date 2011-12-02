/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('../../ofp.js');

var offsetsHeader = ofp.offsets.ofp_header;
var offsetsStats = ofp.offsets.ofp_stats_request;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var stats = {
                            "header" : {"type" : 'OFPST_EXPERIMENTER'},
                            "body" : {}
                        };

                    var len = buffer.readUInt16BE(offset + offsetsHeader.length, true);

                    if (len < ofp.sizes.ofp_stats_request + 4) {  // 4 : experimenter
                        return {
                            "error" : {
                                "desc" : util.format('%s stats message at offset %d has invalid length (%d).', stats.header.type, offset, len),
                                "type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'
                            }
                        }
                    }

                    stats.body.experimenter = buffer.readUInt32BE(offset + ofp.sizes.ofp_stats_request, true);

                    var dataLen = len - ofp.sizes.ofp_stats_request - 4;
                    if (dataLen > 0) {
                        stats.body.data = new Buffer(dataLen);
                        buffer.copy(stats.body.data, 0, offset + ofp.sizes.ofp_stats_request + 4, offset + ofp.sizes.ofp_stats_request + 4 + dataLen);
                    }

                    return {
                        "stats" : stats,
                        "offset" : offset + len
                    }
            },

            "pack" : function(stats, buffer, offset) {
                    var warnings = [];

                    if (buffer.length < offset + ofp.sizes.ofp_stats_request + 4) {
                        return {
                            error : { desc : util.format('%s statistics message at offset %d does not fit the buffer.', stats.header.type, offset)}
                        }
                    }

                    buffer.writeUInt32BE(stats.body.experimenter, offset + ofp.sizes.ofp_stats_request, true);

                    if ('data' in stats.body) {
                        var dataLen = stats.body.data.length;
                        stats.body.data.copy(buffer, offset + ofp.sizes.ofp_stats_request + 4);
                    } else {
                        var dataLen = 0;
                    }

                    if (dataLen < 4) {
                        buffer.fill(0, offset + ofp.sizes.ofp_stats_request + 8 - dataLen, offset + ofp.sizes.ofp_stats_request + 8);
                        var len = ofp.sizes.ofp_stats_request + 8;
                    } else {
                        var len = ofp.sizes.ofp_stats_request + 4 + dataLen;
                    }

                    if (warnings.length == 0) {
                        return {
                            offset : offset + len
                        }
                    } else {
                        return {
                            warnings: warnings,
                            offset : offset + len
                        }
                    }
        }


}

})();
