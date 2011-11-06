/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
                0x02,                    // version = 2
                0x07,                    // type = 7
                0x00, 0x08,              // length = 8
                0x49, 0x96, 0x02, 0xd2   // xid = 1234567890
            ];

module.exports.json = {
                "version" : 2,
                "header" : {
                    "type" : 'OFPT_GET_CONFIG_REQUEST',
                    "xid" : 1234567890
                }
            };
