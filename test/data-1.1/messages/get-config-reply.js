/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
                0x02,                    // version = 2
                0x08,                    // type = 8
                0x00, 0x0c,              // length = 12
                0x49, 0x96, 0x02, 0xd2, // xid = 1234567890
                0x00, 0x06,             // flags = 6
                0x01, 0x00              // miss_send_len = 256
            ];

module.exports.obj = {
                "version" : "1.1",
                "header" : {
                    "type" : 'OFPT_GET_CONFIG_REPLY',
                    "xid" : 1234567890
                },
                "body" : {
                    "flags" : ['OFPC_FRAG_REASM', 'OFPC_INVALID_TTL_TO_CONTROLLER'],
                    "miss_send_len" : 256
                }
            };
