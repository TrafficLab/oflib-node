/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
        0x00, 0x07,        // type = 7
        0x00, 0x08,        // length = 8
        0x80,              // nw_tos = 128
        0x00, 0x00, 0x00   // padding
    ];

module.exports.obj = {
        header : {type : 'OFPAT_SET_NW_TOS'},
        body : {nw_tos : 128}
    };

module.exports.warnings = [];
