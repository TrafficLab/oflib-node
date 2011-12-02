/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
                0x02,                          // version = 2
                0x16,                          // type = 22
                0x00, 0x10,                    // length = 16
                0x49, 0x96, 0x02, 0xd2,        // xid = 1234567890
                  0x00, 0x00, 0x00, 0x12,             // port_no = 18,
                  0x00, 0x00, 0x00, 0x00,             // pad
            ];

module.exports.obj = {
                "version" : '1.1',
                "header" : {
                    "type" : 'OFPT_QUEUE_GET_CONFIG_REQUEST',
                    "xid" : 1234567890
                },
                "body" : {
                    "port" : 18
                }
            };
