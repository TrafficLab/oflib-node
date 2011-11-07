"use strict";

var util = require('util');

module.exports = {
    "objEquals" : function objEquals(obj1, obj2) {

        return objEquals(obj1, obj2, "");

        function objEquals(obj1, obj2, path) {
            if (typeof obj1 != 'object' ||
                typeof obj2 != 'object') {
                    if (obj1 != obj2) {
                        return {"error" : util.format("Value at \"%s\" is not an object (%s).", path, obj2)};
                    } else {
                        return {"equals" : true};
                    }
            }

            var keys1 = Object.keys(obj1).sort();
            var keys2 = Object.keys(obj2).sort();

            if (keys1.length != keys2.length) {
                return {"error" : util.format("Objects at \"%s\" have different number of properties (%j, %j).", path, keys1, keys2)};
            }

            for(var i=0; i<keys1.length; i++) {
                var key1 = keys1[i];
                var key2 = keys2[i];

                if (key1 != key2) {
                    return {"error" : util.format("Objects at \"%s\" have different set of properties (%j, %j).", path, keys1, keys2)};
                }

                var val1 = obj1[key1];
                var val2 = obj2[key1];

                if (Object.prototype.toString.apply(val1) === '[object Array]' &&
                    Object.prototype.toString.apply(val2) === '[object Array]') {
                        var eq = arrEquals(val1, val2, path + '.' + key1);
                        if ('error' in eq) {
                            return eq;
                        }

                } else if (typeof val1 == 'object' &&
                           typeof val2 == 'object') {
                                var eq = objEquals(val1, val2, path + '.' + key1);
                                if ('error' in eq) {
                                    return eq;
                                }
                } else {
                    if (val1 != val2) {
                        return {"error" : util.format("Values at \"%s.%s\" differ (%j, %j).", path, key1, val1, val2)};
                    }
                }
            }

            return {"equals" : true};
        }

        function arrEquals(arr1, arr2, path) {
            if (arr1.length != arr2.length) {
                return {"error" : util.format("Arrays at \"%s\" have different lengths.", path)};
            }

            var s1 = arr1.sort();
            var s2 = arr2.sort();

            for(var i=0; i<s1.length; i++) {
                var val1 = s1[i];
                var val2 = s2[i];

                var eq = objEquals(val1, val2, util.format("%s[%ds]", path, i));
                if ('error' in eq) {
                    return eq;
                }
            }
            return {"equals" : true};
        }

    }
}