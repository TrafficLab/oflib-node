/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

var msg = require('../oflib-1.1/messages/flow-mod.js');

module.exports.stream = [
    {
        data :   new Buffer(msg.bin.slice(0, 100)),
        result : []
    },
    {
        data:    new Buffer(msg.bin.slice(100)),
        result : [{message: msg.obj}]
    }
];
