/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

/* Converts objects to JSON strings and back.
 * Binary data (Buffer object) is converted to:  {'$b' : 'base64 encoded'}
 */
module.exports = {
            stringify : function stringify(obj, space) {
                                return JSON.stringify(obj, function replacer(key, value) {
                                    if (value instanceof Buffer) return {'$b' : value.toString('hex')};
                                    return value;
                                }, space)
            },

            parse : function parse(str) {
                                return JSON.parse(str, function reviver(key, value) {
                                    if (typeof value == 'object' && '$b' in value) return new Buffer(value['$b'], 'hex');
                                    return value;
                                })
            }
    }

module.exports.prototype = JSON;