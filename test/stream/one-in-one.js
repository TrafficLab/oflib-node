/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

var msg = require('../oflib-1.1/messages/flow-mod.js');

module.exports.stream = [
    {
        data :   new Buffer(msg.bin),
        result : [{message: msg.obj}]
    }
];
