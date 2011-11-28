/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
            0xff, 0xff,              // type = 0xffff
            0x00, 0x10,              // length = 16
            0x00, 0x00, 0x01, 0xff,  // experimenter = 511
            0xaa, 0xbb, 0xcc, 0xdd,
            0xee, 0xff, 0xaa, 0xbb,  // data = "aabbccddeeffaabb"
        ];

module.exports.obj = {
                header : {type : 'OFPAT_EXPERIMENTER'},
                body : {
                    experimenter : 511,
                    data : new Buffer([0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff, 0xaa, 0xbb])
                }
            };
