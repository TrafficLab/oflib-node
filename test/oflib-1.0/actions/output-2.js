/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
            0x00, 0x00,  // type = 0
            0x00, 0x08,  // length = 8
            0xff, 0xfd,  // port = OFPP_CONTROLLER
            0x04, 0x72,  // max_len = 1138
        ];

module.exports.obj = {
                "header" : {"type" : 'OFPAT_OUTPUT'},
                "body" : {
                    "port" : 'OFPP_CONTROLLER',
                    "max_len" : 1138
                }
            };
