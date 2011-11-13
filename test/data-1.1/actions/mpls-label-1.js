/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
        0x00, 0x0d,              // type = 13
        0x00, 0x08,              // length = 8
        0x00, 0x01, 0xe2, 0x40   // mpls_label = 123456
    ];

module.exports.obj = {
        "header" : {"type" : 'OFPAT_SET_MPLS_LABEL'},
        "body" : {"mpls_label" : 123456}
    };

