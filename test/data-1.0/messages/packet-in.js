/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
                0x01,                          // version = 1
                0x0a,                          // type = 10
                0x00, 0x19,                    // length = 25
                0x49, 0x96, 0x02, 0xd2,        // xid = 1234567890
                0x00, 0x00, 0x00, 0x13,        // buffer_id = 19
                0x04, 0x00,                    // total_len = 1024
                0x00, 0x02,                    // in_port = 2
                0x01,                          // reason = 1
                0x00,                          // pad
                0x00, 0x00,                    // pad (data)
                0x11, 0x22, 0x33, 0x44, 0x55   // data
            ];

module.exports.obj = {
                "version" : "1.0",
                "header" : {
                    "type" : 'OFPT_PACKET_IN',
                    "xid" : 1234567890
                },
                "body" : {
                    "buffer_id" : 19,
                    "total_len" : 1024,
                    "in_port" : 2,
                    "reason" : 'OFPR_ACTION',
                    "data" : new Buffer([0x11, 0x22, 0x33, 0x44, 0x55])
                }
            };
