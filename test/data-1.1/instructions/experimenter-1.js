/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
        0xff, 0xff,              // type = 0xffff
        0x00, 0x0c,              // length = 12
        0x00, 0x00, 0x00, 0x01,  // experimenter = 1
        0x01, 0x23, 0x45, 0x67   // data
    ];

module.exports.obj = {
            header : {type : 'OFPIT_EXPERIMENTER'},
            body : {
                experimenter : 1,
                data : new Buffer([0x01, 0x23, 0x45, 0x67])
            }
    };
