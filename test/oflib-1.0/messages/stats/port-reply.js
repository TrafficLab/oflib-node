/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
               0x01,                          // version = 1
               0x11,                          // type = 17
               0x00, 0x74,                    // length = 116
               0x49, 0x96, 0x02, 0xd2,        // xid = 1234567890
                 0x00, 0x04,                  // type = 4
                 0x00, 0x01,                  // flags = 1
                   0x00, 0x0d,                                      // port_no = 13
                   0x00, 0x00, 0x00, 0x00, 0x00, 0x00,              // pad
                   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,  // rx_packets = 1
                   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02,  // tx_packets = 2
                   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03,  // rx_bytes = 3
                   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x04,  // tx_bytes = 4
                   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x05,  // rx_dropped = 5
                   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x06,  // tx_dropped = 6
                   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x07,  // rx_errors = 7
                   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08,  // tx_errors = 8
                   0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,  // rx_frame_err (unsupp.)
                   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0a,  // rx_over_err = 10
                   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0b,  // rx_crc_err = 11
                   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0c,  // collisions = 12
        ];

module.exports.obj = {
                "version" : "1.0",
                "header" : {
                    "type" : 'OFPT_STATS_REPLY',
                    "xid" : 1234567890
                },
                "body" : {
                    "header" : {
                        "type" : 'OFPST_PORT',
                        "flags" : ['OFPSF_REPLY_MORE']
                    },
                    "body" : {
                        "stats" : [
                            {
                                "port_no" : 13,
                                "rx_packets" : [0, 1],
                                "tx_packets" : [0, 2],
                                "rx_bytes" : [0, 3],
                                "tx_bytes" : [0, 4],
                                "rx_dropped" : [0, 5],
                                "tx_dropped" : [0, 6],
                                "rx_errors" : [0, 7],
                                "tx_errors" : [0, 8],
                                "rx_over_err" : [0, 10],
                                "rx_crc_err" : [0, 11],
                                "collisions" : [0, 12]
                            }
                        ]
                    }
                }
        };
