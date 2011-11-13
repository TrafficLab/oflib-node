/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

var Int64 = require('node-int64');

module.exports.bin = [
                0x00, 0x00, 0x00, 0x0d,                          // port_no = 13
                0x00, 0x00, 0x00, 0x16,                          // queue_id = 22
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0a,  // tx_bytes = 10
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x14,  // tx_packets = 20
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x1e,  // tx_errors = 30
        ];

module.exports.obj = {
                "port_no" : 13,
                "queue_id" : 22,
                "tx_bytes" : new Int64(0, 10),
                "tx_packets" : new Int64(0, 20),
                "tx_errors" : new Int64(0, 30),
            };
