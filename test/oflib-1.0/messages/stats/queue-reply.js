/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
               0x01,                          // version = 1
               0x11,                          // type = 17
               0x00, 0x4c,                    // length = 76
               0x49, 0x96, 0x02, 0xd2,        // xid = 1234567890
                 0x00, 0x05,                  // type = 5
                 0x00, 0x01,                  // flags = 1
                   0x00, 0x0d,                                      // port_no = 13
                   0x00, 0x00,
                   0x00, 0x00, 0x00, 0x16,                          // queue_id = 22
                   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0a,  // tx_bytes = 10
                   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x14,  // tx_packets = 20
                   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x1e,  // tx_errors = 30
                       0x00, 0x0d,                                      // port_no = 13
                       0x00, 0x00,                                      // pad
                       0x00, 0x00, 0x00, 0x17,                          // queue_id = 23
                       0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0a,  // tx_bytes = 10
                       0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x14,  // tx_packets = 20
                       0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x1e   // tx_errors = 30
        ];

module.exports.obj = {
                "version" : "1.0",
                "header" : {
                    "type" : 'OFPT_STATS_REPLY',
                    "xid" : 1234567890
                },
                "body" : {
                    "header" : {
                        "type" : 'OFPST_QUEUE',
                        "flags" : ['OFPSF_REPLY_MORE']
                    },
                    "body" : {
                        "stats" : [
                            {
                                "port_no" : 13,
                                "queue_id" : 22,
                                "tx_bytes" : [0, 10],
                                "tx_packets" : [0, 20],
                                "tx_errors" : [0, 30],
                            },
                            {
                                "port_no" : 13,
                                "queue_id" : 23,
                                "tx_bytes" : [0, 10],
                                "tx_packets" : [0, 20],
                                "tx_errors" : [0, 30],
                            }
                        ]
                    }
                }
        };
