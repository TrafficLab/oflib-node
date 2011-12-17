/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
               0x01,                          // version = 1
               0x10,                          // type = 16
               0x00, 0x14,                    // length = 20
               0x49, 0x96, 0x02, 0xd2,        // xid = 1234567890
                 0x00, 0x05,                  // type = 5
                 0x00, 0x00,                  // flags = 0
                   0x00, 0x10,                // port_no = 16,
                   0x00, 0x00,                // pad
                   0x00, 0x00, 0x00, 0x20     // queue_id = 32
        ];

module.exports.obj = {
                "version" : "1.0",
                "header" : {
                    "type" : 'OFPT_STATS_REQUEST',
                    "xid" : 1234567890
                },
                "body" : {
                    "header" : {
                        "type" : 'OFPST_QUEUE',
                        "flags" : []
                    },
                    "body" : {
                        "port_no" : 16,
                        "queue_id" : 32
                    }
                }
        };
