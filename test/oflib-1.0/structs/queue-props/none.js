/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
               0x00, 0x00,                          // property = 1
               0x00, 0x08,                          // length = 8
               0x00, 0x00, 0x00, 0x00               // pad
        ];

module.exports.obj = {
                "header" : {"property" : 'OFPQT_NONE'}
            };
