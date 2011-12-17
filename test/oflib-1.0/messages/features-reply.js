/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
                0x01,                    // version = 1
                0x06,                    // type = 6
                0x00, 0x80,              // length = 128
                0x49, 0x96, 0x02, 0xd2,  // xid = 1234567890
                  0x11, 0x22, 0x33, 0x44,
                  0x55, 0x66, 0x77, 0x88,  // datapath_id = "1122334455667788"
                  0x00, 0x01, 0x00, 0x00,  // n_buffers = 65536
                  0xf0,                    // n_tables = 240
                  0x00, 0x00, 0x00,        // pad
                  0x00, 0x00, 0x00, 0x07,  // capabilities = 0000 0111
                  0x00, 0x00, 0x00, 0x03,  // actions
                    0x00, 0x12,                         // port_no = 18,
                    0x11, 0x22, 0x11, 0x33, 0x11, 0x44, // hw_addr = 11:22:11:33:11:44
                    0x65, 0x74, 0x68, 0x31,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,             // name = "eth1"
                    0x00, 0x00, 0x00, 0x60,             // config = 0110 0000
                    0x00, 0x00, 0x00, 0x01,             // state = 0000 0001
                    0x00, 0x00, 0x00, 0x40,             // curr = 0100 0000
                    0x00, 0x00, 0x00, 0x70,             // advertised = 0111 0000
                    0x00, 0x00, 0x00, 0x7c,             // supported = 0111 1100
                    0x00, 0x00, 0x00, 0x00,             // peer = 0 (unsupported)
                        0x00, 0x13,                         // port_no = 19,
                        0x11, 0x22, 0x11, 0x33, 0x11, 0x55, // hw_addr = 11:22:11:33:11:55
                        0x65, 0x74, 0x68, 0x32,
                        0x00, 0x00, 0x00, 0x00,
                        0x00, 0x00, 0x00, 0x00,
                        0x00, 0x00, 0x00, 0x00,             // name = "eth2"
                        0x00, 0x00, 0x00, 0x60,             // config = 0110 0000
                        0x00, 0x00, 0x00, 0x00,             // state = 0000 0000
                        0x00, 0x00, 0x00, 0x40,             // curr = 0100 0000
                        0x00, 0x00, 0x00, 0x70,             // advertised = 0111 0000
                        0x00, 0x00, 0x00, 0x7c,             // supported = 0111 1100
                        0x00, 0x00, 0x00, 0x00,             // peer = 0 (unsupported)
            ];

module.exports.obj = {
                "version" : "1.0",
                "header" : {
                    "type" : 'OFPT_FEATURES_REPLY',
                    "xid" : 1234567890
                },
                "body" : {
                    "datapath_id" : "1122334455667788",
                    "n_buffers" : 65536,
                    "n_tables" : 240,
                    "capabilities" : ['OFPC_FLOW_STATS', 'OFPC_TABLE_STATS', 'OFPC_PORT_STATS'],
                    "actions" : ['OFPAT_OUTPUT', 'OFPAT_SET_VLAN_VID'],
                    "ports" : [
                        {
                            "port_no" : 18,
                            "hw_addr" : '11:22:11:33:11:44',
                            "name" : 'eth1',
                            "config" : ['OFPPC_NO_FWD', 'OFPPC_NO_PACKET_IN'],
                            "state" : ['OFPPS_LINK_DOWN'],
                            "curr" : ['OFPPF_10GB_FD'],
                            "advertised" : ['OFPPF_10GB_FD', 'OFPPF_1GB_FD', 'OFPPF_1GB_HD'],
                            "supported" : ['OFPPF_10GB_FD', 'OFPPF_1GB_FD', 'OFPPF_1GB_HD', 'OFPPF_100MB_FD', 'OFPPF_100MB_HD']
                        },
                        {
                            "port_no" : 19,
                            "hw_addr" : '11:22:11:33:11:55',
                            "name" : 'eth2',
                            "config" : ['OFPPC_NO_FWD', 'OFPPC_NO_PACKET_IN'],
                            "state" : [],
                            "curr" : ['OFPPF_10GB_FD'],
                            "advertised" : ['OFPPF_10GB_FD', 'OFPPF_1GB_FD', 'OFPPF_1GB_HD'],
                            "supported" : ['OFPPF_10GB_FD', 'OFPPF_1GB_FD', 'OFPPF_1GB_HD', 'OFPPF_100MB_FD', 'OFPPF_100MB_HD']
                        }
                    ]
                }
            };
