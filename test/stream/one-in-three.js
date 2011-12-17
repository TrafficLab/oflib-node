/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

var msg = require('../oflib-1.1/messages/flow-mod.js');

module.exports.bufferLength = msg.bin.length;

module.exports.stream = [
    {
        data :   new Buffer(msg.bin.slice(0, 50)),
        result : []
    },
    {
        data :   new Buffer(msg.bin.slice(50, 120)),
        result : []
    },
    {
        data:    new Buffer(msg.bin.slice(120)),
        result : [{message: msg.obj}]
    }
];
