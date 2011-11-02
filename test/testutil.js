/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports = {
    "jsonEqualsStrict" : function jsonEqualsStrict(obj1, obj2) {
        var keys1 = Object.keys(obj1).sort();
        var keys2 = Object.keys(obj2).sort();

        if (keys1.length != keys2.length) {
            return false;
        }

        for(var i=0; i<keys1.length; i++) {
            var key1 = keys1[i];
            var key2 = keys2[i];

            if (key1 != key2) {
                return false;
            }

            var val1 = obj1[key1];
            var val2 = obj2[key2];

            if (typeof val1 == 'object' &&
                typeof val2 == 'object') {
                if (!jsonEqualsStrict(val1, val2)) {
                    return false;
                }
            } else {
                if (val1 != val2) {
                    return false;
                }
            }
        }

        return true;
    }
}
