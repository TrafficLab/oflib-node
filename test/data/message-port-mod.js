/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
                0x02,                          // version = 2
                0x10,                          // type = 16
                0x00, 0x28,                    // length = 40
                0x49, 0x96, 0x02, 0xd2,        // xid = 1234567890
                  0x00, 0x00, 0x00, 0x12,             // port_no = 18,
                  0x00, 0x00, 0x00, 0x00,             // pad
                  0x11, 0x22, 0x11, 0x33, 0x11, 0x44, // hw_addr = 11:22:11:33:11:44
                  0x00, 0x00,                         // pad
                0x00, 0x00, 0x00, 0x60,             // config = 0110 0000
                0x00, 0x00, 0x00, 0x65,             // mask =   0110 0101
                0x00, 0x00, 0x00, 0x70,             // advertise = 0111 0000
                0x00, 0x00, 0x00, 0x00              // pad
            ];

module.exports.obj = {
                "version" : 2,
                "header" : {
                    "type" : 'OFPT_PORT_MOD',
                    "xid" : 1234567890
                },
                "body" : {
                    "port_no" : 18,
                    "hw_addr" : '11:22:11:33:11:44',
                    "config_set" : ['OFPPC_NO_FWD', 'OFPPC_NO_PACKET_IN'],
                    "config_unset" : ['OFPPC_NO_RECV', 'OFPPC_PORT_DOWN'],
                    "advertise" : ['OFPPF_10GB_FD', 'OFPPF_1GB_FD', 'OFPPF_1GB_HD']
                }
            };
