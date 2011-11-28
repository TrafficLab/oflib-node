/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
        0x00, 0x17,        // type = 23
        0x00, 0x08,        // length = 8
        0x24,              // nw_ttl = 36
        0x00, 0x00, 0x00   // padding
    ];

module.exports.obj = {
        header : {type : 'OFPAT_SET_NW_TTL'},
        body : {nw_ttl : 36}
    };

