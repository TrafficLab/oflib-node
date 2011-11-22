/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
            0x00, 0x07,              // type = 7
            0x00, 0x08,              // length = 8
            0xc0, 0xa8, 0x01, 0x01,  // nw_addr = "192.168.1.1"
        ];

module.exports.obj = {
                "header" : {"type" : 'OFPAT_SET_NW_DST'},
                "body" : {"nw_addr" : '192.168.1.1'}
            };
