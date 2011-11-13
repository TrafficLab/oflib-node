/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
                0x00, 0x58,             // length = 88
                0x03,                   // type = 3
                0x00,                   // pad
                0x00, 0x00, 0x00, 0x44, // group_id = 68
                    0x00, 0x28,             // len = 40
                    0x01, 0x02,             // weight = 258
                    0xff, 0xff, 0xff, 0xff, // watch_port (disabled)
                    0x00, 0x00, 0xff, 0xff, // watch_group = 65535
                    0x00, 0x00, 0x00, 0x00, // pad
                      0x00, 0x03,                         // type = 3
                      0x00, 0x10,                         // length = 16
                      0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, // dl_addr = "12:34:56:78:8a:bc"
                      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // pad
                        0x00, 0x05,              // type = 5
                        0x00, 0x08,              // len = 8
                        0xc0, 0xa8, 0x01, 0x01,  // nw_addr = "192.168.1.1"
                    0x00, 0x28,             // len = 40
                    0x01, 0x03,             // weight = 259
                    0xff, 0xff, 0xff, 0xff, // watch_port (disabled)
                    0x00, 0x00, 0xff, 0xff, // watch_group = 65535
                    0x00, 0x00, 0x00, 0x00, // pad
                      0x00, 0x03,                         // type = 3
                      0x00, 0x10,                         // length = 16
                      0x12, 0x34, 0x56, 0x78, 0x9a, 0xbd, // dl_addr = "12:34:56:78:8a:bd"
                      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // pad
                        0x00, 0x05,              // type = 5
                        0x00, 0x08,              // len = 8
                        0xc0, 0xa8, 0x01, 0x02   // nw_addr = "192.168.1.2"
        ];

module.exports.obj = {
            "type" : 'OFPGT_FF',
            "group_id" : 68,
            "buckets" : [
                {
                    "weight" : 258,
                    "watch_group" : 65535,
                    "actions" : [
                        {
                            "header" : {"type" : 'OFPAT_SET_DL_SRC'},
                            "body" : {"dl_addr" : '12:34:56:78:9a:bc'}
                        },
                        {
                            "header" : {"type" : 'OFPAT_SET_NW_SRC'},
                            "body" : {"nw_addr" : '192.168.1.1'}
                        }
                    ]
                },
                {
                    "weight" : 259,
                    "watch_group" : 65535,
                    "actions" : [
                        {
                            "header" : {"type" : 'OFPAT_SET_DL_SRC'},
                            "body" : {"dl_addr" : '12:34:56:78:9a:bd'}
                        },
                        {
                            "header" : {"type" : 'OFPAT_SET_NW_SRC'},
                            "body" : {"nw_addr" : '192.168.1.2'}
                        }
                    ]
                }
            ]
        };
