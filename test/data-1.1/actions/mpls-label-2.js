/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
        0x00, 0x0d,              // type = 13
        0x00, 0x08,              // length = 8
        0x12, 0x34, 0x56, 0x78   // mpls_label = 305419896 (INVALID)
    ];

module.exports.warnings = [];
