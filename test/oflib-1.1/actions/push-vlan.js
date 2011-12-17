/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
            0x00, 0x11,  // type = 17
            0x00, 0x08,  // length = 8
            0x81, 0x00,  // ethertype = 0x8100
            0x00, 0x00   // padding
        ];

module.exports.obj = {
                header : {type : 'OFPAT_PUSH_VLAN'},
                body : {ethertype : 0x8100}
            };
