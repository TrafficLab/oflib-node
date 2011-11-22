/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

module.exports.bin = [
            0x01,                    // version = 1
            0x04,                    // type = 4
            0x00, 0x10,              // length = 16
            0x49, 0x96, 0x02, 0xd2,  // xid = 1234567890
              0x00, 0x00, 0x00, 0x01,  // vendor = 1
              0xaa, 0xbb, 0xcc, 0xdd
        ];

module.exports.obj = {
                "version" : "1.0",
                "header" : {
                    "type" : 'OFPT_VENDOR',
                    "xid" : 1234567890
                },
                "body" : {
                    "vendor" : 1,
                    "data" : new Buffer([0xaa, 0xbb, 0xcc, 0xdd])
                }
            };
