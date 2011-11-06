/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
            0x02,                          // version = 2
            0x02,                          // type = 2
            0x00, 0x0d,                    // length = 13
            0x49, 0x96, 0x02, 0xd2,        // xid = 1234567890
            0xaa, 0xbb, 0xcc, 0xdd, 0xee   // data = "aabbccddee"
        ];

module.exports.json = {
                "version" : 2,
                "header" : {
                    "type" : 'OFPT_ECHO_REQUEST',
                    "xid" : 1234567890
                },
                "body" : {"data" : 'aabbccddee'}
            };
