/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

var Int64 = require('node-int64');

module.exports.bin = [
                0x0d,                                            // table_id = 13
                0x00, 0x00, 0x00,                                // pad
                0x54, 0x61, 0x62, 0x6c, 0x65, 0x20, 0x31, 0x33,
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,  // name = "Table 13"
                0x00, 0x00, 0x00, 0x01,                          // wildcards = 0001
                0x00, 0x00, 0x00, 0x50,                          // max_entries = 80
                0x00, 0x00, 0x00, 0x30,                          // active_count = 48
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x05,  // lookup_count = 5
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03   // matched_count = 3
        ];

module.exports.obj = {
                "table_id" : 13,
                "name" : "Table 13",
                "wildcards" : ['OFPFW_IN_PORT'],
                "max_entries" : 80,
                "active_count" : 48,
                "lookup_count" : new Int64(0, 5),
                "matched_count" : new Int64(0, 3)
            };
