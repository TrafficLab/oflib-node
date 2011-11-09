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
            },

            "setIfNotEq" : function setIfNotEq(obj, prop, value, guard) {
                if (value != guard) {
                    obj[prop] = value;
                }
            },

            "setEnum" : function setEnum(obj, prop, value, map) {
                if (map[value] == undefined) {
                    return false;
                }
                obj[prop] = map[value];
                return true;
            },

            "UINT64_NONE" : new Buffer([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
            "UINT64_ALL"  : new Buffer([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff])
    }
