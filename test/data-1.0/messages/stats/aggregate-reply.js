/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
               0x01,                          // version = 1
               0x11,                          // type = 17
               0x00, 0x24,                    // length = 36
               0x49, 0x96, 0x02, 0xd2,        // xid = 1234567890
                 0x00, 0x02,                  // type = 2
                 0x00, 0x01,                  // flags = 1
                   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, // packet_count = 1
                   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, // byte_count = 2
                   0x00, 0x00, 0x00, 0x03,                         // flow_count = 3
                   0x00, 0x00, 0x00, 0x00                          // padding
        ];

module.exports.obj = {
                "version" : "1.0",
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
                        "packet_count" : [0, 1],
                        "byte_count" : [0, 2],
                        "flow_count" : 3,
                    }
                }
        };
