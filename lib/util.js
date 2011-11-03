/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

var util = require('util');

module.exports = {
            "parseFlags" : function parseFlags(flags, map) {
                var array = [];
                var remain = flags;

                var keys = Object.keys(map);
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    var flag = map[key];

                    if ((flags & flag) != 0) {
                        array.push(key);
                        remain -= flag;
                    }
                }

                return {
                    "array" : array,
                    "remain" : remain
                }
            }
    }
