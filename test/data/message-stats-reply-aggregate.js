/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
               0x02,                          // version = 2
               0x13,                          // type = 19
               0x00, 0x28,                    // length = 40
               0x49, 0x96, 0x02, 0xd2,        // xid = 1234567890
                 0x00, 0x02,                  // type = 2
                 0x00, 0x01,                  // flags = 1
                 0x00, 0x00, 0x00, 0x00,      // pad
                   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, // packet_count = 1
                   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, // byte_count = 2
                   0x00, 0x00, 0x00, 0x03,                         // flow_count = 3
                   0x00, 0x00, 0x00, 0x00                          // padding
        ];

module.exports.json = {
                "version" : 2,
                "header" : {
                    "type" : 'OFPT_STATS_REPLY',
                    "xid" : 1234567890
                },
                "body" : {
                    "header" : {
                        "type" : 'OFPST_AGGREGATE',
                        "flags" : ['OFPSF_REPLY_MORE']
                    },
                    "body" : {
                        "packet_count" : {"high" : 0, "low" : 1},
                        "byte_count" : {"high" : 0, "low" : 2},
                        "flow_count" : 3,
                    }
                }
        };
