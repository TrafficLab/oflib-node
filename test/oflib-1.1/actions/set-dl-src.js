/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
            0x00, 0x03,                          // type = 3
            0x00, 0x10,                          // length = 16
            0x11, 0x22, 0x33, 0x44, 0x55, 0xaa,  // dl_addr = "11:22:33:44:55:aa"
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00   // padding
        ];

module.exports.obj = {
                header : {type : 'OFPAT_SET_DL_SRC'},
                body : {dl_addr : '11:22:33:44:55:aa'}
            };
