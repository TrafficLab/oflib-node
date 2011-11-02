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
    var bin = [0x00, 0x00,                          // type = 0
               0x00, 0x10,                          // length = 16
               0x00, 0x00, 0x00, 0x01,              // port = 1
               0x00, 0x00,                          // max_len 
               0x00, 0x00, 0x00, 0x00, 0x00, 0x00]; // padding

    var json = {
            "action" : {"type" : 'OFPAT_OUTPUT', "port" : 1},
            "offset" : 16
            };

    var res = oflib.unpackAction(new Buffer(bin), 0);
    assert(testutil.jsonEqualsStrict(res, json), util.format('Expected %j,\n received %j', json, res));
    console.log("OK.");
}());

(function() {
    console.log("2. ...");
    var bin = [0x00, 0x00,                          // type = 0
               0x00, 0x10,                          // length = 16
               0xff, 0xff, 0xff, 0x0fd,             // port = OFPP_CONTROLLER
               0x04, 0x72,                          // max_len = 1138
               0x00, 0x00, 0x00, 0x00, 0x00, 0x00]; // padding

    var json = {
            "action" : {"type" : 'OFPAT_OUTPUT', "port" : 'OFPP_CONTROLLER', "max_len" : 1138},
            "offset" : 16
            };

    var res = oflib.unpackAction(new Buffer(bin), 0);
    assert(testutil.jsonEqualsStrict(res, json), util.format('Expected %j,\n received %j', json, res));
    console.log("OK.");
}());

(function() {
    console.log("3. ...");
    var bin = [0x00, 0x00,                          // type = 0
               0x00, 0x10,                          // length = 16
               0xff, 0xff, 0xff, 0x01,              // port = 0xffffff01 (INVALID)
               0x00, 0x00,                          // max_len
               0x00, 0x00, 0x00, 0x00, 0x00, 0x00]; // padding

    var res = oflib.unpackAction(new Buffer(bin), 0);
    assert('error' in res, util.format('Expected "error" key,\n received %j', res));
    console.log("OK.");
}());
