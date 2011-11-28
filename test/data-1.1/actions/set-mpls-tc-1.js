/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
        0x00, 0x0e,        // type = 14
        0x00, 0x08,        // length = 8
        0x02,              // mpls_tc = 2
        0x00, 0x00, 0x00   // padding
    ];

module.exports.obj = {
        header : {type : 'OFPAT_SET_MPLS_TC'},
        body : {mpls_tc : 2}
    };

