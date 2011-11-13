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
var offsets = ofp.offsets.ofp_desc_stats;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var stats = {
                            "header" : {"type" : 'OFPST_DESC'},
                            "body" : {}
                        };

                    var len = buffer.readUInt16BE(offset + offsetsHeader.length, true);

                    if (len != ofp.sizes.ofp_stats_reply + ofp.sizes.ofp_desc_stats) {
                        return {
                            "error" : {
                                "desc" : util.format('%s stats message at offset %d has invalid length (%d).', stats.header.type, offset, len)
                            }
                        }
                    }

                    stats.body.mfr_desc = buffer.toString('utf8', offset + ofp.sizes.ofp_stats_reply + offsets.mfr_desc, offset + ofp.sizes.ofp_stats_reply + offsets.mfr_desc + ofp.DESC_STR_LEN);
                    stats.body.mfr_desc = stats.body.mfr_desc.substr(0, stats.body.mfr_desc.indexOf('\0'));

                    stats.body.hw_desc = buffer.toString('utf8', offset + ofp.sizes.ofp_stats_reply + offsets.hw_desc, offset + ofp.sizes.ofp_stats_reply + offsets.hw_desc + ofp.DESC_STR_LEN);
                    stats.body.hw_desc = stats.body.hw_desc.substr(0, stats.body.hw_desc.indexOf('\0'));

                    stats.body.sw_desc = buffer.toString('utf8', offset + ofp.sizes.ofp_stats_reply + offsets.sw_desc, offset + ofp.sizes.ofp_stats_reply + offsets.sw_desc + ofp.DESC_STR_LEN);
                    stats.body.sw_desc = stats.body.sw_desc.substr(0, stats.body.sw_desc.indexOf('\0'));

                    stats.body.serial_num = buffer.toString('utf8', offset + ofp.sizes.ofp_stats_reply + offsets.serial_num, offset + ofp.sizes.ofp_stats_reply + offsets.serial_num + ofp.SERIAL_NUM_LEN);
                    stats.body.serial_num = stats.body.serial_num.substr(0, stats.body.serial_num.indexOf('\0'));

                    stats.body.dp_desc = buffer.toString('utf8', offset + ofp.sizes.ofp_stats_reply + offsets.dp_desc, offset + ofp.sizes.ofp_stats_reply + offsets.dp_desc + ofp.DESC_STR_LEN);
                    stats.body.dp_desc = stats.body.dp_desc.substr(0, stats.body.dp_desc.indexOf('\0'));

                    return {
                        "stats" : stats,
                        "offset" : offset + len
                    }
            }

}

})();


