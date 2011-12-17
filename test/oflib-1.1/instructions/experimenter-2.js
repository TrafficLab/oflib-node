/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
        0xff, 0xff,              // type = 0xffff
        0x00, 0x08,              // length = 8
        0x00, 0x00, 0x00, 0x02   // experimenter = 2
    ];

module.exports.obj = {
            header : {type : 'OFPIT_EXPERIMENTER'},
            body : {experimenter : 2}
    };
