/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
               0x01,                          // version = 1
               0x10,                          // type = 16
               0x00, 0x0c,                    // length = 12
               0x49, 0x96, 0x02, 0xd2,        // xid = 1234567890
                 0x00, 0x00,                  // type = 0
                 0x00, 0x00,                  // flags = 0
        ];

module.exports.obj = {
                "version" : "1.0",
                "header" : {
                    "type" : 'OFPT_STATS_REQUEST',
                    "xid" : 1234567890
                },
                "body" : {
                    "header" : {
                        "type" : 'OFPST_DESC',
                        "flags" : []
                    }
                }
        };
