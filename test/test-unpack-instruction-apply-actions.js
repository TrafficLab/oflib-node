/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

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
            "instruction" : {
                "header" : {"type" : 'OFPIT_APPLY_ACTIONS'},
                "body" : {
                    "actions" : [
                        {
                            "header" : {"type" : 'OFPAT_SET_DL_SRC'},
                            "body" : {"dl_addr" : '12:34:56:78:9a:bc'}
                        },
                        {
                            "header" : {"type" : 'OFPAT_SET_NW_SRC'},
                            "body" : {"nw_addr" : '192.168.1.1'}
                        }
                    ]
                }
            },
            "offset" : 32
        };

    var test = testutil.objEquals(oflib.unpackInstruction(new Buffer(bin), 0), json);
    if ('error' in test) {
        console.error(test.error);
    } else {
        console.log("OK.");
    }
}());
