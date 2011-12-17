/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
        0x00, 0x10,              // type = 16
        0x00, 0x08,              // length = 8
        0x00, 0x00, 0x00, 0x00   // padding
    ];

module.exports.obj = {
        header : {type : 'OFPAT_DEC_MPLS_TTL'}
    };

