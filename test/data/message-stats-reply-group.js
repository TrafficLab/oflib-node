/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
               0x02,                          // version = 2
               0x13,                          // type = 19
               0x00, 0x90,                    // length = 144
               0x49, 0x96, 0x02, 0xd2,        // xid = 1234567890
                 0x00, 0x06,                  // type = 6
                 0x00, 0x01,                  // flags = 1
                 0x00, 0x00, 0x00, 0x00,      // pad
                   0x00, 0x40,                                      // length = 64
                   0x00, 0x00,                                      // pad
                   0x00, 0x00, 0x00, 0x22,                          // group_id = 34
                   0x00, 0x00, 0x00, 0x03,                          // ref_count = 3
                   0x00, 0x00, 0x00, 0x00,                          // padding
                   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,  // packet_count = 1,
                   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x19,  // byte_count = 25,
                      0x00, 0x00, 0x00, 0x1a, 0x21, 0xa2, 0x78, 0xbe,  // packet_count = 112233445566
                      0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0xe2, 0x40,  // byte_count = 123456
                          0x00, 0x00, 0x00, 0x1a, 0x21, 0xa2, 0x78, 0xbf,  // packet_count = 112233445567
                          0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0xe2, 0x41,  // byte_count = 123457
                   0x00, 0x40,                                      // length = 64
                   0x00, 0x00,                                      // pad
                   0x00, 0x00, 0x00, 0x23,                          // group_id = 35
                   0x00, 0x00, 0x00, 0x04,                          // ref_count = 4
                   0x00, 0x00, 0x00, 0x00,                          // padding
                   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,  // packet_count = 1,
                   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x19,  // byte_count = 25,
                      0x00, 0x00, 0x00, 0x1a, 0x21, 0xa2, 0x78, 0xbe,  // packet_count = 112233445566
                      0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0xe2, 0x40,  // byte_count = 123456
                          0x00, 0x00, 0x00, 0x1a, 0x21, 0xa2, 0x78, 0xbf,  // packet_count = 112233445567
                          0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0xe2, 0x41   // byte_count = 123457
        ];

module.exports.json = {
                "version" : 2,
                "header" : {
                    "type" : 'OFPT_STATS_REPLY',
                    "xid" : 1234567890
                },
                "body" : {
                    "header" : {
                        "type" : 'OFPST_GROUP',
                        "flags" : ['OFPSF_REPLY_MORE']
                    },
                    "body" : {
                        "stats" : [
                            {
                                "group_id" : 34,
                                "ref_count" : 3,
                                "packet_count" : {"high" : 0, "low" : 1},
                                "byte_count" : {"high" : 0, "low" : 25},
                                "bucket_stats" : [
                                    {
                                        "packet_count" : {"high" : 26, "low" : 564295870}, // 26 * 2^32 + 564295870 = 112233445566
                                        "byte_count" : {"high" : 0, "low" : 123456}
                                    },
                                    {
                                        "packet_count" : {"high" : 26, "low" : 564295871}, // 26 * 2^32 + 564295871 = 112233445567
                                        "byte_count" : {"high" : 0, "low" : 123457}
                                    },
                                ]
                            },
                            {
                                "group_id" : 35,
                                "ref_count" : 4,
                                "packet_count" : {"high" : 0, "low" : 1},
                                "byte_count" : {"high" : 0, "low" : 25},
                                "bucket_stats" : [
                                    {
                                        "packet_count" : {"high" : 26, "low" : 564295870}, // 26 * 2^32 + 564295870 = 112233445566
                                        "byte_count" : {"high" : 0, "low" : 123456}
                                    },
                                    {
                                        "packet_count" : {"high" : 26, "low" : 564295871}, // 26 * 2^32 + 564295871 = 112233445567
                                        "byte_count" : {"high" : 0, "low" : 123457}
                                    },
                                ]
                            },
                        ]
                    }
                }
        };
