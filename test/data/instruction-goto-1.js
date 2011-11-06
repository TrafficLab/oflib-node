/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
        0x00, 0x01,        // type = 1
        0x00, 0x08,        // length = 8
        0x0d,              // table_id = 13
        0x00, 0x00, 0x00   // pad
    ];

module.exports.json = {
                "header" : {"type" : 'OFPIT_GOTO_TABLE'},
                "body" : {"table_id" : 13}
        };
