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
    var bin = [0x00, 0x00, 0x00, 0x1a, 0x21, 0xa2, 0x78, 0xbe,  // packet_count = 112233445566
               0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0xe2, 0x40]; // byte_count = 123456

    var json = {
            "bucket_counter" : {
                "packet_count" : {"high" : 26, "low" : 564295870}, // 26 * 2^32 + 564295870 = 112233445566
                "byte_count" : {"high" : 0, "low" : 123456}
            },
            "offset" : 16
        }

    var res = oflib.unpackStruct.bucketCounter(new Buffer(bin), 0);
    assert(testutil.jsonEqualsStrict(res, json), util.format('Expected %j,\n received %j', json, res));
    console.log("OK.");
}());
