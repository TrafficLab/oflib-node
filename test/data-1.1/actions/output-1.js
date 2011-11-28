/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
            0x00, 0x00,                          // type = 0
            0x00, 0x10,                          // length = 16
            0x00, 0x00, 0x00, 0x01,              // port = 1
            0x00, 0x00,                          // max_len
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00   // padding
        ];

module.exports.obj = {
                header : {type : 'OFPAT_OUTPUT'},
                body : {port : 1}
            };
