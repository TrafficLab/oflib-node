/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
        0x00, 0x00,                          // type = 0
        0x00, 0x10,                          // length = 16
        0xff, 0xff, 0xff, 0x01,              // port = 0xffffff01 (INVALID)
        0x00, 0x00,                          // max_len
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00   // padding
    ];

module.exports.warnings = [];
