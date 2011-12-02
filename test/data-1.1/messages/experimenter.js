/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
               0x02,                          // version = 2
               0x04,                          // type = 4
               0x00, 0x14,                    // length = 20
               0x49, 0x96, 0x02, 0xd2,        // xid = 1234567890
                   0x00, 0x00, 0x00, 0x12,    // experimenter = 18,
                   0x01, 0x02, 0x03, 0x04,
                   0x05, 0x06, 0x07, 0x08     // data = '0102030405060708
        ];

module.exports.obj = {
                version : '1.1',
                header : {
                    type : 'OFPT_EXPERIMENTER',
                    xid : 1234567890
                },
                body : {
                    experimenter: 18,
                    data: new Buffer([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08])
                }
        };
