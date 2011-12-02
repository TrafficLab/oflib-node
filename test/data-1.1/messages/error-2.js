/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
            0x02,                    // version = 2
            0x01,                    // type = 1
            0x00, 0x0c,              // length = 12
            0x49, 0x96, 0x02, 0xd2,  // xid = 1234567890
            0x00, 0x05,              // error_type = 5
            0x00, 0x03               // error_code = 3
        ];

module.exports.obj = {
                version : '1.1',
                header : {
                    type : 'OFPT_ERROR',
                    xid : 1234567890
                },
                body : {
                    type : 'OFPET_FLOW_MOD_FAILED',
                    code : 'OFPFMFC_OVERLAP'
                }
            };
