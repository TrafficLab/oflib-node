/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

var msg1 = require('../oflib-1.1/messages/flow-mod.js');
var msg2 = require('../oflib-1.1/messages/group-mod.js');

module.exports.stream = [
    {
        data :   new Buffer(msg1.bin.slice(0, 100)),
        result : []
    },
    {
        data:    new Buffer(msg1.bin.slice(100).concat(msg2.bin)),
        result : [ {message: msg1.obj}, {message: msg2.obj} ]
    }
];
