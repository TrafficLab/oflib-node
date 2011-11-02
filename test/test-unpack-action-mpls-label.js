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
    var bin = [0x00, 0x0d,              // type = 13
               0x00, 0x08,              // length = 8
               0x00, 0x01, 0xe2, 0x40]; // mpls_label = 123456

    var json = {
            "action" : {"type" : 'OFPAT_SET_MPLS_LABEL', "mpls_label" : 123456},
            "offset" : 8
            };

    var res = oflib.unpackAction(new Buffer(bin), 0);
    assert(testutil.jsonEqualsStrict(res, json), util.format('Expected %j,\n received %j', json, res));
    console.log("OK.");
}());

(function() {
    console.log("2. ...");
    var bin = [0x00, 0x0d,              // type = 13
               0x00, 0x08,              // length = 8
               0x12, 0x34, 0x56, 0x78]; // mpls_label = 305419896 (INVALID)

    var res = oflib.unpackAction(new Buffer(bin), 0);
    assert('error' in res, util.format('Expected "error" key,\n received %j', res));
    console.log("OK.");
}());
