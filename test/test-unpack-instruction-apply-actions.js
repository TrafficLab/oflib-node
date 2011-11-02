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
    var bin = [0x00, 0x04,              // type = 4
               0x00, 0x20,              // length = 32
               0x00, 0x00, 0x00, 0x00,  // pad
                 0x00, 0x03,                         // type = 3
                 0x00, 0x10,                         // length = 16
                 0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, // dl_addr = "12:34:56:78:8a:bc"
                 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // pad
                   0x00, 0x05,             // type = 5
                   0x00, 0x08,             // len = 8
                   0xc0, 0xa8, 0x01, 0x01] // nw_addr = "192.168.1.1"

    var json = {
            "instruction" : {"type" : 'OFPIT_APPLY_ACTIONS',
                             "actions" : [
                                 {"type" : 'OFPAT_SET_DL_SRC', "dl_addr" : '12:34:56:78:9a:bc'},
                                 {"type" : 'OFPAT_SET_NW_SRC', "nw_addr" : '192.168.1.1'}
                             ]
                            },
             "offset" : 32
        };

    var res = oflib.unpackInstruction(new Buffer(bin), 0);
    assert(testutil.jsonEqualsStrict(res, json), util.format('Expected %j,\n received %j', json, res));
    console.log("OK.");
}());
