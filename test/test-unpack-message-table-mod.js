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
    var bin = [0x02,                          // version = 2
               0x11,                          // type = 17
               0x00, 0x10,                    // length = 16
               0x49, 0x96, 0x02, 0xd2,        // xid = 1234567890
                 0x13,                        // table_id = 19
                 0x00, 0x00, 0x00,            // pad
                 0x00, 0x00, 0x00, 0x02];     // config = 2


    var json = {
            "message" : {"type" : 'OFPT_TABLE_MOD', "xid" : 1234567890,
                         "table_id" : 19,
                         "config" : 'OFPTC_TABLE_MISS_DROP'
            },
            "offset" : 16
        }
    var res = oflib.unpackMessage(new Buffer(bin), 0);
    assert(testutil.jsonEqualsStrict(res, json), util.format('Expected %j,\n received %j', json, res));
    console.log("OK.");
}());
