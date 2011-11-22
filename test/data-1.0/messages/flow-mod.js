/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
                0x01,                          // version = 1
                0x0e,                          // type = 14
                0x00, 0x60,                    // length = 96
                0x49, 0x96, 0x02, 0xd2,        // xid = 1234567890
                    0x00, 0x34, 0x08, 0xc2,             // wildcards = 11 010000 001000 1100 0010
                    0x00, 0x10,                         // in_port = 16,
                    0x11, 0x22, 0x33, 0x44, 0x00, 0x00, // dl_src = "11:22:33:44:00:00"
                    0xaa, 0xbb, 0xcc, 0x00, 0x00, 0x00, // dl_dst = "aa:bb:cc:00:00:00"
                    0x00, 0x00,                         // dl_vlan (wildcarded)
                    0x00,                               // dl_vlan_pcp (wildcarded)
                    0x00,                               // pad
                    0x08, 0x00,                         // dl_type = 2048 (0x800)
                    0x00,                               // nw_tos (wildcarded)
                    0x06,                               // nw_proto = 6
                    0x00, 0x00,                         // pad
                    0xc0, 0xa8, 0x01, 0x00,             // nw_src = "192.168.1.0"
                    0xc0, 0xa8, 0x00, 0x00,             // nw_dst = "192.168.0.0"
                    0x00, 0x00,                         // tp_src (wildcarded)
                    0x00, 0x00,                         // tp_dst (wildcarded)
                0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, // cookie = "1122334455667788"
                0x00, 0x00,                                     // command = 0,
                0x00, 0x00,                                     // idle_timeout = 0 (disabled)
                0x00, 0xff,                                     // hard_timeout = 255
                0x01, 0x00,                                     // priority = 256
                0x00, 0x00, 0x00, 0x01,                         // buffer_id = 1,
                0x00, 0x08,                                     // out_port = 8,
                0x00, 0x03,                                     // flags = 3
                    0x00, 0x04,                         // type = 4
                    0x00, 0x10,                         // length = 16
                    0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, // dl_addr = "12:34:56:78:8a:bc"
                    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // pad
                      0x00, 0x06,             // type = 6
                      0x00, 0x08,             // len = 8
                      0xc0, 0xa8, 0x01, 0x01, // nw_addr = "192.168.1.1"
            ];

module.exports.obj = {
                "version" : "1.0",
                "header" : {
                    "type" : 'OFPT_FLOW_MOD',
                    "xid" : 1234567890
                },
                "body" : {
                    "match" : {
                        "in_port" : 16,
                        "dl_src" : '11:22:33:44:00:00',
                        'dl_dst' : 'aa:bb:cc:00:00:00',
                        "dl_type" : 2048,
                        "nw_proto" : 6,
                        "nw_src" : '192.168.1.0',
                        "nw_src_mask" : 8,
                        "nw_dst" : '192.168.0.0',
                        "nw_dst_mask" : 16
                    },
                    "cookie" : new Buffer([0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88]),
                    "command" : 'OFPFC_ADD',
                    "hard_timeout" : 255,
                    "priority" : 256,
                    "buffer_id" : 1,
                    "out_port" : 8,
                    "flags" : ['OFPFF_SEND_FLOW_REM', 'OFPFF_CHECK_OVERLAP'],
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
