/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
            0x01,                    // version = 1
            0x01,                    // type = 1
            0x00, 0x0c,              // length = 12
            0x49, 0x96, 0x02, 0xd2,  // xid = 1234567890
            0x00, 0x03,              // error_type = 3
            0x00, 0x01               // error_code = 1
        ];

module.exports.obj = {
                "version" : "1.0",
                "header" : {
                    "type" : 'OFPT_ERROR',
                    "xid" : 1234567890
                },
                "body" : {
                    "type" : 'OFPET_FLOW_MOD_FAILED',
                    "code" : 'OFPFMFC_OVERLAP'
                }
            };
