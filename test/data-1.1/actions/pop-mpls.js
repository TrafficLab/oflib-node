/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
            0x00, 0x14,  // type = 20
            0x00, 0x08,  // length = 8
            0x00, 0x11,  // ethertype = 17
            0x00, 0x00   // padding
        ];

module.exports.obj = {
                header : {type : 'OFPAT_POP_MPLS'},
                body : {ethertype : 17}
            };
