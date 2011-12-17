/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
            0x00, 0x16,                          // type = 22
            0x00, 0x08,                          // length = 8
            0x00, 0x00, 0xff, 0x0ff,             // group = 65535
        ];

module.exports.obj = {
                header : {type : 'OFPAT_GROUP'},
                body : {group_id : 65535}
            };
