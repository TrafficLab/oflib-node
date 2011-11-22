/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
            0x00, 0x04,  // type = 4
            0x00, 0x10,                          // length = 16
            0x00, 0x01, 0x02, 0x03, 0x04, 0x05,  // dl_addr = "00:01:02:03:04:05"
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00   // padding
        ];

module.exports.obj = {
                "header" : {"type" : 'OFPAT_SET_DL_SRC'},
                "body" : {"dl_addr" : '00:01:02:03:04:05'}
            };
