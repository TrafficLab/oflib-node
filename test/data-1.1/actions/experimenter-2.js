/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
            0xff, 0xff,              // type = 0xffff
            0x00, 0x08,              // length = 8
            0x00, 0x00, 0x02, 0x00,  // experimenter = 512
        ];

module.exports.obj = {
                header : {type : 'OFPAT_EXPERIMENTER'},
                body : {experimenter : 512}
            };
