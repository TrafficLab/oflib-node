/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

module.exports.bin = [
            0x01,                    // version = 1
            0x13,                    // type = 19
            0x00, 0x08,              // length = 8
            0x49, 0x96, 0x02, 0xd2   // xid = 1234567890
        ];

module.exports.obj = {
                "version" : "1.0",
                "header" : {
                    "type" : 'OFPT_BARRIER_REPLY',
                    "xid" : 1234567890
                }
            };
