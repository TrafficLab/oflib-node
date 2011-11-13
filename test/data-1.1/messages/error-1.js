/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
            0x02,                    // version = 2
            0x01,                    // type = 1
            0x00, 0x10,              // length = 16
            0x49, 0x96, 0x02, 0xd2,  // xid = 1234567890
            0x00, 0x02,              // error_type = 2
            0x00, 0x01,              // error_code = 1
            0xab, 0xbc, 0xcd, 0xde   // data = "abbccdde"
        ];

module.exports.obj = {
                "version" : "1.1",
                "header" : {
                    "type" : 'OFPT_ERROR',
                    "xid" : 1234567890
                },
                "body" : {
                    "type" : 'OFPET_BAD_ACTION',
                    "code" : 'OFPBAC_BAD_LEN',
                    "data" : new Buffer([0xab, 0xbc, 0xcd, 0xde])
                }
            };
