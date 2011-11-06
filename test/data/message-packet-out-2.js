/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
               0x02,                          // version = 2
               0x0d,                          // type = 13
               0x00, 0x35,                    // length = 53
               0x49, 0x96, 0x02, 0xd2,        // xid = 1234567890
                 0x00, 0x00, 0x00, 0x0d,             // buffer_id = 13
                 0x00, 0x00, 0x00, 0x02,             // in_port = 2
                 0x00, 0x18,                         // actions_len = 24
                 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // pad
                   0x00, 0x03,                         // type = 3
                   0x00, 0x10,                         // length = 16
                   0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, // dl_addr = "12:34:56:78:8a:bc"
                   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // pad
                     0x00, 0x05,             // type = 5
                     0x00, 0x08,             // len = 8
                     0xc0, 0xa8, 0x01, 0x01, // nw_addr = "192.168.1.1"
                 0x11, 0x22, 0x33, 0x44, 0x55   // data
        ];

module.exports.json = {
                "version" : 2,
                "header" : {
                    "type" : 'OFPT_PACKET_OUT',
                    "xid" : 1234567890
                },
                "body" : {
                    "buffer_id" : 13,
                    "in_port" : 2,
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
                }
            };
