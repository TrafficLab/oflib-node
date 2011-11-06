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
               0x02,                    // type = 2
               0x00, 0x08,              // length = 8
               0x49, 0x96, 0x02, 0xd2]; // xid = 1234567890

    var json = {
            "message" : {
                "version" : 2,
                "header" : {
                    "type" : 'OFPT_ECHO_REQUEST',
                    "xid" : 1234567890
                },
                "body" : {}
            },
            "offset" : 8
        };

    var test = testutil.objEquals(oflib.unpackMessage(new Buffer(bin), 0), json);
    if ('error' in test) {
        console.error(test.error);
    } else {
        console.log("OK.");
    }
}());

(function() {
    console.log("2. ...");
    var bin = [0x02,                          // version = 2
               0x02,                          // type = 2
               0x00, 0x0d,                    // length = 13
               0x49, 0x96, 0x02, 0xd2,        // xid = 1234567890
               0xaa, 0xbb, 0xcc, 0xdd, 0xee]; // data = "aabbccddee"

    var json = {
            "message" : {
                "version" : 2,
                "header" : {
                    "type" : 'OFPT_ECHO_REQUEST',
                    "xid" : 1234567890
                },
                "body" : {"data" : 'aabbccddee'}
            },
            "offset" : 13
        };

    var test = testutil.objEquals(oflib.unpackMessage(new Buffer(bin), 0), json);
    if ('error' in test) {
        console.error(test.error);
    } else {
        console.log("OK.");
    }
}());
