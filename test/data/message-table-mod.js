/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
               0x02,                          // version = 2
               0x11,                          // type = 17
               0x00, 0x10,                    // length = 16
               0x49, 0x96, 0x02, 0xd2,        // xid = 1234567890
                 0x13,                        // table_id = 19
                 0x00, 0x00, 0x00,            // pad
                 0x00, 0x00, 0x00, 0x02       // config = 2
        ];

module.exports.json = {
                "version" : 2,
                "header" : {
                    "type" : 'OFPT_TABLE_MOD',
                    "xid" : 1234567890
                },
                "body" : {
                    "table_id" : 19,
                    "config" : 'OFPTC_TABLE_MISS_DROP'
                }
        };
