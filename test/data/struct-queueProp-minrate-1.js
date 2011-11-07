/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
               0x00, 0x01,                          // property = 1
               0x00, 0x10,                          // length = 16
               0x00, 0x00, 0x00, 0x00,              // pad
                   0x00, 0xfe,                         // rate = 254
                   0x00, 0x00, 0x00, 0x00, 0x00, 0x00
        ];

module.exports.json = {
                "header" : {"property" : 'OFPQT_MIN_RATE'},
                "body" : {"rate" : 254}
            };
