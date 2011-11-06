/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

var assert = require('assert');
var util = require('util');
var testutil = require('./testutil.js');
var oflib = require('../lib/oflib.js');

(function() {
    console.log("1. ...");
    var bin = [0x02,                    // version = 2
               0x06,                    // type = 6
               0x00, 0xa0,              // length = 160
               0x49, 0x96, 0x02, 0xd2,  // xid = 1234567890
                 0x11, 0x22, 0x33, 0x44,
                 0x55, 0x66, 0x77, 0x88,  // dpid = "1122334455667788"
                 0x00, 0x01, 0x00, 0x00,  // n_buffers = 65536
                 0xf0,                    // n_tables = 240
                 0x00, 0x00, 0x00,        // pad
                 0x00, 0x00, 0x00, 0xef,  // capabilities = 1110 1111
                 0x00, 0x00, 0x00, 0x00,  // reserved
                   0x00, 0x00, 0x00, 0x12,             // port_no = 18,
                   0x00, 0x00, 0x00, 0x00,             // pad
                   0x11, 0x22, 0x11, 0x33, 0x11, 0x44, // hw_addr = 11:22:11:33:11:44
                   0x00, 0x00,                         // pad
                   0x65, 0x74, 0x68, 0x31,
                   0x00, 0x00, 0x00, 0x00,
                   0x00, 0x00, 0x00, 0x00,
                   0x00, 0x00, 0x00, 0x00,             // name = "eth1"
                   0x00, 0x00, 0x00, 0x60,             // config = 0110 0000
                   0x00, 0x00, 0x00, 0x04,             // state = 0000 0100
                   0x00, 0x00, 0x00, 0x40,             // curr = 0100 0000
                   0x00, 0x00, 0x00, 0x70,             // advertised = 0111 0000
                   0x00, 0x00, 0x00, 0x7c,             // supported = 0111 1100
                   0x00, 0x00, 0x00, 0x00,             // peer = 0 (unsupported)
                   0x00, 0x00, 0x00, 0x80,             // curr_speed = 128
                   0x00, 0x00, 0x01, 0x00,             // max_speed = 256
                       0x00, 0x00, 0x00, 0x13,             // port_no = 19,
                       0x00, 0x00, 0x00, 0x00,             // pad
                       0x11, 0x22, 0x11, 0x33, 0x11, 0x55, // hw_addr = 11:22:11:33:11:55
                       0x00, 0x00,                         // pad
                       0x65, 0x74, 0x68, 0x31,
                       0x00, 0x00, 0x00, 0x00,
                       0x00, 0x00, 0x00, 0x00,
                       0x00, 0x00, 0x00, 0x00,             // name = "eth1"
                       0x00, 0x00, 0x00, 0x60,             // config = 0110 0000
                       0x00, 0x00, 0x00, 0x04,             // state = 0000 0100
                       0x00, 0x00, 0x00, 0x40,             // curr = 0100 0000
                       0x00, 0x00, 0x00, 0x70,             // advertised = 0111 0000
                       0x00, 0x00, 0x00, 0x7c,             // supported = 0111 1100
                       0x00, 0x00, 0x00, 0x00,             // peer = 0 (unsupported)
                       0x00, 0x00, 0x00, 0x80,             // curr_speed = 128
                       0x00, 0x00, 0x01, 0x00];            // max_speed = 256



    var json = {
            "message" : {
                "version" : 2,
                "header" : {
                    "type" : 'OFPT_FEATURES_REPLY',
                    "xid" : 1234567890
                },
                "body" : {
                    "datapath_id" : "1122334455667788",
                    "n_buffers" : 65536,
                    "n_tables" : 240,
                    "capabilities" : ['OFPC_FLOW_STATS', 'OFPC_TABLE_STATS', 'OFPC_PORT_STATS', 'OFPC_GROUP_STATS',
                                      'OFPC_IP_REASM', 'OFPC_QUEUE_STATS', 'OFPC_ARP_MATCH_IP'],
                    "ports" : [
                        {
                            "port_no" : 18,
                            "hw_addr" : '11:22:11:33:11:44',
                            "name" : 'eth1',
                            "config" : ['OFPPC_NO_FWD', 'OFPPC_NO_PACKET_IN'],
                            "state" : ['OFPPS_LIVE'],
                            "curr" : ['OFPPF_10GB_FD'],
                            "advertised" : ['OFPPF_10GB_FD', 'OFPPF_1GB_FD', 'OFPPF_1GB_HD'],
                            "supported" : ['OFPPF_10GB_FD', 'OFPPF_1GB_FD', 'OFPPF_1GB_HD', 'OFPPF_100MB_FD', 'OFPPF_100MB_HD'],
                            "curr_speed" : 128,
                            "max_speed" : 256
                        },
                        {
                            "port_no" : 19,
                            "hw_addr" : '11:22:11:33:11:55',
                            "name" : 'eth1',
                            "config" : ['OFPPC_NO_FWD', 'OFPPC_NO_PACKET_IN'],
                            "state" : ['OFPPS_LIVE'],
                            "curr" : ['OFPPF_10GB_FD'],
                            "advertised" : ['OFPPF_10GB_FD', 'OFPPF_1GB_FD', 'OFPPF_1GB_HD'],
                            "supported" : ['OFPPF_10GB_FD', 'OFPPF_1GB_FD', 'OFPPF_1GB_HD', 'OFPPF_100MB_FD', 'OFPPF_100MB_HD'],
                            "curr_speed" : 128,
                            "max_speed" : 256
                        }
                    ]
                }
            },
            "offset" : 160
        };

    var test = testutil.objEquals(oflib.unpackMessage(new Buffer(bin), 0), json);
    if ('error' in test) {
        console.error(test.error);
    } else {
        console.log("OK.");
    }
}());
