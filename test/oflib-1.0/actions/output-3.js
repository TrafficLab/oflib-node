/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
            0x00, 0x00,  // type = 0
            0x00, 0x08,  // length = 8
            0xff, 0xf1,  // port = invalid
            0x00, 0x00,  // max_len
        ];

module.exports.warnings = [];
