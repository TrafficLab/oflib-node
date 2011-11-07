/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
               0x02,                          // version = 2
               0x13,                          // type = 19
               0x00, 0x78,                    // length = 120
               0x49, 0x96, 0x02, 0xd2,        // xid = 1234567890
                 0x00, 0x04,                  // type = 4
                 0x00, 0x01,                  // flags = 1
                 0x00, 0x00, 0x00, 0x00,      // pad
                   0x00, 0x00, 0x00, 0x0d,                          // port_no = 13
                   0x00, 0x00, 0x00, 0x00,                          // pad
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

module.exports.json = {
                "version" : 2,
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
                                "rx_packets" : {"high" : 0, "low" : 1},
                                "tx_packets" : {"high" : 0, "low" : 2},
                                "rx_bytes" : {"high" : 0, "low" : 3},
                                "tx_bytes" : {"high" : 0, "low" : 4},
                                "rx_dropped" : {"high" : 0, "low" : 5},
                                "tx_dropped" : {"high" : 0, "low" : 6},
                                "rx_errors" : {"high" : 0, "low" : 7},
                                "tx_errors" : {"high" : 0, "low" : 8},
                                "rx_over_err" : {"high" : 0, "low" : 10},
                                "rx_crc_err" : {"high" : 0, "low" : 11},
                                "collisions" : {"high" : 0, "low" : 12}
                            }
                        ]
                    }
                }
        };
