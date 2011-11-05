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
               0x0b,                    // type = 11
               0x00, 0x88,              // length = 136
               0x49, 0x96, 0x02, 0xd2, // xid = 1234567890
               0xaa, 0xbb, 0xcc, 0xdd, 0xaa, 0xbb, 0xcc, 0xdd, // cookie = "aabbccddaabbccdd"
               0x01, 0xff,                                     // priority = 511
               0x00,                                           // reason = 0
               0x11,                                           // table_id = 17
               0x00, 0x00, 0x10, 0x00,                         // duration_sec = 4096
               0x00, 0x00, 0x00, 0x01,                         // duration_nsec = 1
               0x0e, 0x00,                                     // idle_timeout = 3584
               0x00, 0x00,                                     // pad
               0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x10, // packet_count = 16
               0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x12, // byte_count = 18
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
                 0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]; // metadata_mask = "00000000ffffffff"

    var json = {
            "message" : {"type" : 'OFPT_FLOW_REMOVED', "xid" : 1234567890,
                         "cookie" : 'aabbccddaabbccdd',
                         "reason" : 'OFPRR_IDLE_TIMEOUT',
                         "table_id" : 17,
                         "priority" : 511,
                         "duration_sec" : 4096,
                         "duration_nsec" : 1,
                         "idle_timeout" : 3584,
                         "packet_count" : {"high" : 0, "low" : 16},
                         "byte_count" : {"high" : 0, "low" : 18},
                         "match" : {
                           "type" : 'OFMPT_STANDARD',
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
                           "metadata" : '1122334400000000',
                           "metadata_mask" : '00000000ffffffff'
                          }
                },
            "offset" : 136
        }

    var res = oflib.unpackMessage(new Buffer(bin), 0);
    assert(testutil.jsonEqualsStrict(res, json), util.format('Expected %j,\n received %j', json, res));
    console.log("OK.");
}());
