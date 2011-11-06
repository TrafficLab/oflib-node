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
    var bin = [0x00, 0x01,        // type = 1
               0x00, 0x08,        // length = 8
               0x0d,              // table_id = 13
               0x01, 0xe2, 0x40]; // pad

    var json = {
            "instruction" : {
                "header" : {"type" : 'OFPIT_GOTO_TABLE'},
                "body" : {"table_id" : 13}
            },
            "offset" : 8
        };

    var test = testutil.objEquals(oflib.unpackInstruction(new Buffer(bin), 0), json);
    if ('error' in test) {
        console.error(test.error);
    } else {
        console.log("OK.");
    }
}());

(function() {
    console.log("2. ...");
    var bin = [0x00, 0x01,        // type = 1
               0x00, 0x08,        // length = 8
               0xff,              // table_id = 255 (INVALID)
               0x01, 0xe2, 0x40]; // pad

    var res = oflib.unpackInstruction(new Buffer(bin), 0);
    if (!('error' in res)) {
        console.error(util.format('Expected "error", received %j', res));
    } else {
        console.log("OK.");
    }
}());
