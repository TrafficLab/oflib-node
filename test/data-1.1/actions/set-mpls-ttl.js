/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
        0x00, 0x0f,        // type = 15
        0x00, 0x08,        // length = 8
        0x22,              // mpls_ttl = 34
        0x00, 0x00, 0x00   // padding
    ];

module.exports.obj = {
        header : {type : 'OFPAT_SET_MPLS_TTL'},
        body : {mpls_ttl : 34}
    };

