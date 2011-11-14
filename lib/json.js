/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

var Int64 = require('node-int64');


/* Converts objects to JSON strings and back.
 * Binary data (Buffer object) is converted to:  {"$b" : "base64 encoded"}
 * uint64 numbers (Int64 object) is converted to: {"$i" : "hex string"}
 */
module.exports = {
            "stringify" : function stringify(obj, space) {
                                return JSON.stringify(obj, function replacer(key, value) {
                                    if (value instanceof Buffer) return {"$b" : value.toString('hex')};
                                    if (value instanceof Int64) return {"$i" : value.toOctetString()};
                                    return value;
                                }, space)
                        },


            "parse" : function parse(str) {
                                return JSON.parse(str, function reviver(key, value) {
                                    if (typeof value == 'object' && '$b' in value) return new Buffer(value['$b'], 'hex');
                                    if (typeof value == 'object' && '$i' in value) return new Int64(value['$i']);
                                    return value;
                                })
                        },

            "Int64" : Int64
    }

module.exports.prototype = JSON;