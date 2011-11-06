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
               0x09,                    // type = 9
               0x00, 0x0c,              // length = 12
               0x49, 0x96, 0x02, 0xd2, // xid = 1234567890
               0x00, 0x05,             // flags = 5
               0x01, 0x00];            // miss_send_len = 256

    var json = {
            "message" : {
                "version" : 2,
                "header" : {
                    "type" : 'OFPT_SET_CONFIG',
                    "xid" : 1234567890
                },
                "body" : {
                    "flags" : ['OFPC_FRAG_DROP', 'OFPC_INVALID_TTL_TO_CONTROLLER'],
                    "miss_send_len" : 256
                }
            },
            "offset" : 12
        };

    var test = testutil.objEquals(oflib.unpackMessage(new Buffer(bin), 0), json);
    if ('error' in test) {
        console.err(test.error);
    } else {
        console.log("OK.");
    }
}());
