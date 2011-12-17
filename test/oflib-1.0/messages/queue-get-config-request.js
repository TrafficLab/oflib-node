/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
                0x01,                          // version = 1
                0x14,                          // type = 20
                0x00, 0x0c,                    // length = 12
                0x49, 0x96, 0x02, 0xd2,        // xid = 1234567890
                  0x00, 0x12,                  // port_no = 18
                  0x00, 0x00                   // pad
            ];

module.exports.obj = {
                "version" : "1.0",
                "header" : {
                    "type" : 'OFPT_QUEUE_GET_CONFIG_REQUEST',
                    "xid" : 1234567890
                },
                "body" : {
                    "port" : 18
                }
            };
