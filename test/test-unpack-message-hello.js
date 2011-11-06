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
               0x00,                    // type = 0
               0x00, 0x08,              // length = 8
               0x49, 0x96, 0x02, 0xd2]; // xid = 1234567890

    var json = {
            "message" : {
                "version" : 2,
                "header" : {
                    "type" : 'OFPT_HELLO',
                    "xid" : 1234567890
                }
            },
            "offset" : 8
        };

    var test = testutil.objEquals(oflib.unpackMessage(new Buffer(bin), 0), json);
    if ('error' in test) {
        console.err(test.error);
    } else {
        console.log("OK.");
    }
}());
