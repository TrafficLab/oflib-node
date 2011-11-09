/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
                0x02,                          // version = 2
                0x0e,                          // type = 14
                0x00, 0xb0,                    // length = 176
                0x49, 0x96, 0x02, 0xd2,        // xid = 1234567890
                  0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, // cookie = "1122334455667788"
                  0xaa, 0xab, 0xac, 0xad, 0xae, 0xaf, 0xba, 0xbb, // cookie_mask = "aaabacadaeafbabb"
                  0x10,                                           // table_id = 16,
                  0x00,                                           // command = 0,
                  0x00, 0x00,                                     // idle_timeout = 0 (disabled)
                  0x00, 0xff,                                     // hard_timeout = 255
                  0x01, 0x00,                                     // priority = 256
                  0x00, 0x00, 0x00, 0x01,                         // buffer_id = 1,
                  0x00, 0x00, 0x00, 0x08,                         // out_port = 8,
                  0xff, 0xff, 0xff, 0xff,                         // out_group = 0 (disabled)
                  0x00, 0x03,                                     // flags = 3
                  0x00, 0x00,                                     // pad
                    0x00, 0x00,                         // type = 0
                    0x00, 0x58,                         // length = 88
                    0x00, 0x00, 0x00, 0x10,             // in_port = 16,
                    0x00, 0x00, 0x03, 0xd6,             // wildcards = 11 1101 0110
                    0x11, 0x22, 0x33, 0x44, 0x00, 0x00, // dl_src = "11:22:33:44:00:00"
                    0x00, 0x00, 0x00, 0x00, 0xff, 0xff, // dl_src_mask = "00:00:00:00:ff:ff"
                    0xaa, 0xbb, 0xcc, 0x00, 0x00, 0x00, // dl_dst = "aa:bb:cc:00:00:00"
                    0x00, 0x00, 0x00, 0xff, 0xff, 0xff, // dl_dst_mask = "00:00:00:ff:ff:ff"
                    0x00, 0x00,                         // dl_vlan (wildcarded)
                    0x00,                               // dl_vlan_pcp (wildcarded)
                    0x00,                               // pad
                    0x08, 0x00,                         // dl_type = 2048 (0x800)
                    0x00,                               // nw_tos (wildcarded)
                    0x06,                               // nw_proto = 6
                    0xc0, 0xa8, 0x01, 0x00,             // nw_src = "192.168.1.0"
                    0x00, 0x00, 0x00, 0xff,             // nw_src_mask = 0.0.0.255"
                    0xc0, 0xa8, 0x00, 0x00,             // nw_dst = "192.168.0.0"
                    0x00, 0x00, 0xff, 0xff,             // nw_dst_mask = 0.0.255.255"
                    0x00, 0x00,                         // tp_src (wildcarded)
                    0x00, 0x00,                         // tp_dst (wildcarded)
                    0x00, 0x00, 0x00, 0x00,             // mpls_label (wildcarded)
                    0x00,                               // mpls_tc (wildcarded)
                    0x00, 0x00, 0x00,                   // pad
                    0x11, 0x22, 0x33, 0x44, 0x00, 0x00, 0x00, 0x00, // metadata = "1122334400000000"
                    0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff, // metadata_mask = "00000000ffffffff"
                      0x00, 0x04,              // type = 4
                      0x00, 0x20,              // length = 32
                      0x00, 0x00, 0x00, 0x00,  // pad
                        0x00, 0x03,                         // type = 3
                        0x00, 0x10,                         // length = 16
                        0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, // dl_addr = "12:34:56:78:8a:bc"
                        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // pad
                          0x00, 0x05,             // type = 5
                          0x00, 0x08,             // len = 8
                          0xc0, 0xa8, 0x01, 0x01, // nw_addr = "192.168.1.1"
                      0x00, 0x01,        // type = 1
                      0x00, 0x08,        // length = 8
                      0x0d,              // table_id = 13
                      0x01, 0xe2, 0x40   // pad
            ];

module.exports.obj = {
                "version" : 2,
                "header" : {
                    "type" : 'OFPT_FLOW_MOD',
                    "xid" : 1234567890
                },
                "body" : {
                    "cookie" : new Buffer([0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88]),
                    "cookie_mask" : new Buffer([0xaa, 0xab, 0xac ,0xad, 0xae ,0xaf ,0xba ,0xbb]),
                    "table_id" : 16,
                    "command" : 'OFPFC_ADD',
                    "hard_timeout" : 255,
                    "priority" : 256,
                    "buffer_id" : 1,
                    "out_port" : 8,
                    "flags" : ['OFPFF_SEND_FLOW_REM', 'OFPFF_CHECK_OVERLAP'],
                    "match" : {
                        "header" : {"type" : 'OFMPT_STANDARD'},
                        "body" : {
                            "in_port" : 16,
                            "dl_src" : '11:22:33:44:00:00',
                            "dl_src_mask" : '00:00:00:00:ff:ff',
                            'dl_dst' : 'aa:bb:cc:00:00:00',
                            "dl_dst_mask" : '00:00:00:ff:ff:ff',
                            "dl_type" : 2048,
                            "nw_proto" : 6,
                            "nw_src" : '192.168.1.0',
                            "nw_src_mask" : '0.0.0.255',
                            "nw_dst" : '192.168.0.0',
                            "nw_dst_mask" : '0.0.255.255',
                            "metadata" : new Buffer([0x11, 0x22, 0x33, 0x44, 0x00, 0x00, 0x00, 0x00]),
                            "metadata_mask" : new Buffer([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff])
                        }
                    },
                    "instructions" : [
                        {
                            "header" : {"type" : 'OFPIT_APPLY_ACTIONS'},
                            "body" : {
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
                        },
                        {
                            "header" : {"type" : 'OFPIT_GOTO_TABLE'},
                            "body" : {"table_id" : 13}
                        }
                    ]
                }
            };
