/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
               0x02,                          // version = 2
               0x13,                          // type = 19
               0x00, 0x1c,                    // length = 28
               0x49, 0x96, 0x02, 0xd2,        // xid = 1234567890
                 0xff, 0xff,                  // type = 0xffff
                 0x00, 0x00,                  // flags = 0
                 0x00, 0x00, 0x00, 0x00,      // pad
                   0x00, 0x00, 0x00, 0x12,    // experimenter = 18,
                   0x01, 0x02, 0x03, 0x04,
                   0x05, 0x06, 0x07, 0x08     // data = '0102030405060708
        ];

module.exports.obj = {
                version : '1.1',
                header : {
                    type : 'OFPT_STATS_REPLY',
                    xid : 1234567890
                },
                body : {
                    header : {
                        type : 'OFPST_EXPERIMENTER',
                        flags : []
                    },
                    body : {
                        experimenter: 18,
                        data: new Buffer([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08])
                    }
                }
        };
