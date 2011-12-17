/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
            0x00, 0x15,                          // type = 21
            0x00, 0x08,                          // length = 8
            0x00, 0x00, 0xff, 0x0fe,             // queue_id = 65534
        ];

module.exports.obj = {
                header : {type : 'OFPAT_SET_QUEUE'},
                body : {queue_id : 65534}
            };
