/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
               0x00, 0x01,                          // property = 1
               0x00, 0x10,                          // length = 16
               0x00, 0x00, 0x00, 0x00,              // pad
                   0xff, 0xff,                         // rate (disabled)
                   0x00, 0x00, 0x00, 0x00, 0x00, 0x00
        ];

module.exports.obj = {
                "header" : {"property" : 'OFPQT_MIN_RATE'},
                "body" : {}
            };
