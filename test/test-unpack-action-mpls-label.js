/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

var util = require('util');
var testutil = require('./testutil.js');
var oflib = require('../lib/oflib.js');

(function() {
    console.log("1. ...");
    var bin = [0x00, 0x0d,              // type = 13
               0x00, 0x08,              // length = 8
               0x00, 0x01, 0xe2, 0x40]; // mpls_label = 123456

    var json = {
            "action" : {
                "header" : {"type" : 'OFPAT_SET_MPLS_LABEL'},
                "body" : {"mpls_label" : 123456}
            },
            "offset" : 8
        };

    var test = testutil.objEquals(oflib.unpackAction(new Buffer(bin), 0), json);
    if ('error' in test) {
        console.error(test.error);
    } else {
        console.log("OK.");
    }
}());

(function() {
    console.log("2. ...");
    var bin = [0x00, 0x0d,              // type = 13
               0x00, 0x08,              // length = 8
               0x12, 0x34, 0x56, 0x78]; // mpls_label = 305419896 (INVALID)

    var res = oflib.unpackAction(new Buffer(bin), 0);
    if (!('error' in res)) {
        console.error(util.format('Expected "error", received %j', res));
    } else {
        console.log("OK.");
    }
}());
