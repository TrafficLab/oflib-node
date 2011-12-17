/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
        0x00, 0x05,              // type = 5
        0x00, 0x08,              // length = 8
        0x00, 0x00, 0x00, 0x00,  // pad
    ];

module.exports.obj = {
            header : {type : 'OFPIT_CLEAR_ACTIONS'},
    };
