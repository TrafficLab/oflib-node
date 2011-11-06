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
    var bin = [0x00, 0x00, 0x00, 0x12,             // port_no = 18,
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
               0x00, 0x00, 0x01, 0x00];            // max_speed = 256

    var json = {
            "port" : {
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
            "offset" : 64
        }
    var test = testutil.objEquals(oflib.unpackStruct.port(new Buffer(bin), 0), json);
    if ('error' in test) {
        console.err(test.error);
    } else {
        console.log("OK.");
    }
}());
