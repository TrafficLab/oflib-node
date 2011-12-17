/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

module.exports.bin = [
            0x02,                    // version = 2
            0x05,                    // type = 5
            0x00, 0x08,              // length = 8
            0x49, 0x96, 0x02, 0xd2   // xid = 1234567890
        ];

module.exports.obj = {
                version : '1.1',
                header : {
                    type : 'OFPT_FEATURES_REQUEST',
                    xid : 1234567890
                }
            };
