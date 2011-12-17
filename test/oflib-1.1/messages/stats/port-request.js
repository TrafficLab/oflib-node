/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
               0x02,                          // version = 2
               0x12,                          // type = 18
               0x00, 0x18,                    // length = 24
               0x49, 0x96, 0x02, 0xd2,        // xid = 1234567890
                 0x00, 0x04,                  // type = 4
                 0x00, 0x00,                  // flags = 0
                 0x00, 0x00, 0x00, 0x00,      // pad
                   0x00, 0x00, 0x00, 0x01,    // port_no = 1,
                   0x00, 0x00, 0x00, 0x00
        ];

module.exports.obj = {
                "version" : '1.1',
                "header" : {
                    "type" : 'OFPT_STATS_REQUEST',
                    "xid" : 1234567890
                },
                "body" : {
                    "header" : {
                        "type" : 'OFPST_PORT',
                        "flags" : []
                    },
                    "body" : {
                        "port_no" : 1
                    }
                }
        };
