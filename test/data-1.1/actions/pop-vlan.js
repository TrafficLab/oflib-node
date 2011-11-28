/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
        0x00, 0x12,              // type = 18
        0x00, 0x08,              // length = 8
        0x00, 0x00, 0x00, 0x00   // padding
    ];

module.exports.obj = {
        header : {type : 'OFPAT_POP_VLAN'}
    };

