/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
            0x00, 0x0a,  // type = 10
            0x00, 0x08,  // length = 8
            0x00, 0x13,  // tp_port = 19
            0x00, 0x00   // padding
        ];

module.exports.obj = {
                header : {type : 'OFPAT_SET_TP_DST'},
                body : {tp_port : 19}
            };
