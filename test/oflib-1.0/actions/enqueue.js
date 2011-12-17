/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
            0x00, 0x0b,                          // type = 11
            0x00, 0x10,                          // length = 16
            0x00, 0x10,                          // port = 16
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00,  // padding
            0x00, 0x00, 0x00, 0x03               // queue_id = 3
        ];

module.exports.obj = {
                "header" : {"type" : 'OFPAT_ENQUEUE'},
                "body" : {
                        "port" : 16,
                        "queue_id" : 3
                    }
            };
