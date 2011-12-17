/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
            0x00, 0x09,    // type = 9
            0x00, 0x08,    // length = 8
            0x02, 0x01,    // tp_port = 513
            0x00, 0x00     // padding
        ];

module.exports.obj = {
                "header" : {"type" : 'OFPAT_SET_TP_SRC'},
                "body" : {"tp_port" : 513}
            };
