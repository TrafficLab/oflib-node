/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
            0x00, 0x13,  // type = 19
            0x00, 0x08,  // length = 8
            0x88, 0x47,  // ethertype = 0x8847
            0x00, 0x00   // padding
        ];

module.exports.obj = {
                header : {type : 'OFPAT_PUSH_MPLS'},
                body : {ethertype : 0x8847}
            };
