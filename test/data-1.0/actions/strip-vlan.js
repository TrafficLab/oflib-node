/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
            0x00, 0x03,              // type = 3
            0x00, 0x08,              // length = 8
            0x00, 0x00, 0x00, 0x00,  // padding
        ];

module.exports.obj = {
                "header" : {"type" : 'OFPAT_STRIP_VLAN'},
                "body" : {}
            };
