/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

var Int64 = require('node-int64');

module.exports.bin = [
               0x01,                          // version = 1
               0x11,                          // type = 17
               0x00, 0xcc,                    // length = 204
               0x49, 0x96, 0x02, 0xd2,        // xid = 1234567890
                 0x00, 0x03,                  // type = 3
                 0x00, 0x01,                  // flags = 1
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
                   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03,  // matched_count = 3
                       0x0e,                                            // table_id = 14
                       0x00, 0x00, 0x00,                                // pad
                       0x54, 0x61, 0x62, 0x6c, 0x65, 0x20, 0x31, 0x34,
                       0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                       0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                       0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,  // name = "Table 14"
                       0x00, 0x00, 0x00, 0x01,                          // wildcards = 0001
                       0x00, 0x00, 0x00, 0x50,                          // max_entries = 80
                       0x00, 0x00, 0x00, 0x30,                          // active_count = 48
                       0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x05,  // lookup_count = 5
                       0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03,  // matched_count = 3
                           0x0f,                                            // table_id = 15
                           0x00, 0x00, 0x00,                                // pad
                           0x54, 0x61, 0x62, 0x6c, 0x65, 0x20, 0x31, 0x35,
                           0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                           0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                           0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,  // name = "Table 15"
                           0x00, 0x00, 0x00, 0x01,                          // wildcards = 0001
                           0x00, 0x00, 0x00, 0x50,                          // max_entries = 80
                           0x00, 0x00, 0x00, 0x30,                          // active_count = 48
                           0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x05,  // lookup_count = 5
                           0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03   // matched_count = 3
        ];
module.exports.obj = {
                "version" : "1.0",
                "header" : {
                    "type" : 'OFPT_STATS_REPLY',
                    "xid" : 1234567890
                },
                "body" : {
                    "header" : {
                        "type" : 'OFPST_TABLE',
                        "flags" : ['OFPSF_REPLY_MORE']
                    },
                    "body" : {
                        "stats" : [
                            {
                                "table_id" : 13,
                                "name" : "Table 13",
                                "wildcards" : ['OFPFW_IN_PORT'],
                                "max_entries" : 80,
                                "active_count" : 48,
                                "lookup_count" : new Int64(0, 5),
                                "matched_count" : new Int64(0, 3)
                            },
                            {
                                "table_id" : 14,
                                "name" : "Table 14",
                                "wildcards" : ['OFPFW_IN_PORT'],
                                "max_entries" : 80,
                                "active_count" : 48,
                                "lookup_count" : new Int64(0, 5),
                                "matched_count" : new Int64(0, 3)
                            },
                            {
                                "table_id" : 15,
                                "name" : "Table 15",
                                "wildcards" : ['OFPFW_IN_PORT'],
                                "max_entries" : 80,
                                "active_count" : 48,
                                "lookup_count" : new Int64(0, 5),
                                "matched_count" : new Int64(0, 3)
                            }
                        ]
                    }
                }
        };
