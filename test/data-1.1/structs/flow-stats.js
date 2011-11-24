/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
                0x00, 0xb0,                                      // length = 176
                0x11,                                            // table_id = 17
                0x00,                                            // pad
                0x00, 0x00, 0x00, 0x20,                          // duration_sec = 32
                0x00, 0x00, 0x00, 0x40,                          // duration_nsec = 64
                0xff, 0xff,                                      // priority = 65535
                0x00, 0x00,                                      // idle_timeout (disabled)
                0x00, 0xff,                                      // hard_timeout = 255
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00,              // padding
                0xaa, 0xaa, 0xbb, 0xbb, 0xaa, 0xaa, 0xbb, 0xbb,  // cookie = "aaaabbbbaaaabbbb"
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,  // packet_count = 1,
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x19,  // byte_count = 25,
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
                   0x11, 0x22, 0x33, 0x44, 0x00, 0x00, 0x00, 0x00,  // metadata = "1122334400000000"
                   0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff,  // metadata_mask = "00000000ffffffff"
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
                "table_id" : 17,
                "duration_sec" : 32,
                "duration_nsec" : 64,
                "priority" : 65535,
                "hard_timeout" : 255,
                "cookie" : new Buffer([0xaa, 0xaa, 0xbb, 0xbb, 0xaa, 0xaa, 0xbb, 0xbb]),
                "packet_count" : [0, 1],
                "byte_count" : [0, 25],
                "match" : {
                    "header" : {"type" : 'OFPMT_STANDARD'},
                    "body" : {
                        "in_port" : 16,
                        "dl_src" : '11:22:33:44:00:00',
                        "dl_src_mask" : '00:00:00:00:ff:ff',
                        "dl_dst" : 'aa:bb:cc:00:00:00',
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
        };
