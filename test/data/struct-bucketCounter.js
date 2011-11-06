/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
               0x00, 0x00, 0x00, 0x1a, 0x21, 0xa2, 0x78, 0xbe,  // packet_count = 112233445566
               0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0xe2, 0x40   // byte_count = 123456
        ];

module.exports.json = {
                "packet_count" : {"high" : 26, "low" : 564295870}, // 26 * 2^32 + 564295870 = 112233445566
                "byte_count" : {"high" : 0, "low" : 123456}
            };
