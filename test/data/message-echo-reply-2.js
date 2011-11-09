/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
            0x02,                          // version = 2
            0x03,                          // type = 3
            0x00, 0x0d,                    // length = 13
            0x49, 0x96, 0x02, 0xd2,        // xid = 1234567890
            0xaa, 0xbb, 0xcc, 0xdd, 0xee   // data = "aabbccddee"
        ];

module.exports.obj = {
                "version" : 2,
                "header" : {
                    "type" : 'OFPT_ECHO_REPLY',
                    "xid" : 1234567890
                },
                "body" : {"data" : new Buffer([0xaa, 0xbb, 0xcc, 0xdd, 0xee])}
            };
