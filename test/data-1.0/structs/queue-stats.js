/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
                0x00, 0x0d,                                      // port_no = 13
                0x00, 0x00,                                      // pad
                0x00, 0x00, 0x00, 0x16,                          // queue_id = 22
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0a,  // tx_bytes = 10
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x14,  // tx_packets = 20
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x1e,  // tx_errors = 30
        ];

module.exports.obj = {
                "port_no" : 13,
                "queue_id" : 22,
                "tx_bytes" : [0, 10],
                "tx_packets" : [0, 20],
                "tx_errors" : [0, 30],
            };
