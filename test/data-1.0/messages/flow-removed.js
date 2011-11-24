/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
                0x01,                    // version = 1
                0x0b,                    // type = 11
                0x00, 0x58,              // length = 88
                0x49, 0x96, 0x02, 0xd2, // xid = 1234567890
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
                0xaa, 0xbb, 0xcc, 0xdd, 0xaa, 0xbb, 0xcc, 0xdd, // cookie = "aabbccddaabbccdd"
                0x01, 0xff,                                     // priority = 511
                0x00,                                           // reason = 0
                0x00,                                           // pad
                0x00, 0x00, 0x10, 0x00,                         // duration_sec = 4096
                0x00, 0x00, 0x00, 0x01,                         // duration_nsec = 1
                0x0e, 0x00,                                     // idle_timeout = 3584
                0x00, 0x00,                                     // pad
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x10, // packet_count = 16
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x12, // byte_count = 18
        ];

module.exports.obj = {
                "version" : "1.0",
                "header" : {
                    "type" : 'OFPT_FLOW_REMOVED',
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
                    "cookie" : new Buffer([0xaa, 0xbb, 0xcc, 0xdd, 0xaa, 0xbb, 0xcc, 0xdd]),
                    "priority" : 511,
                    "reason" : 'OFPRR_IDLE_TIMEOUT',
                    "duration_sec" : 4096,
                    "duration_nsec" : 1,
                    "idle_timeout" : 3584,
                    "packet_count" : [0, 16],
                    "byte_count" : [0, 18],
                }
            };
