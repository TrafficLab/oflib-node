"use strict";

var util = require('util');

module.exports = {
    "bufEquals" : function bufEquals(buf1, buf2, length) {
        if (buf1.length < length || buf2.length < length) {
            return {error : util.format('Buffers are too short (%s, %s).', buf1.toString('hex', 0, length), buf2.toString('hex', 0, length))}
        }

        for (var i=0; i<length; i++) {
            if (buf1[i] != buf2[i]) { return {error : util.format('Buffers differ at %d (%d, %d),  (%s, %s).', i, buf1[i], buf2[i], buf1.toString('hex', 0, length), buf2.toString('hex', 0, length))}}
        }

        return {equals: true};
    },

    "objEquals" : function objEquals(obj1, obj2) {

        return objEquals(obj1, obj2, "");

        function objEquals(obj1, obj2, path) {
            if (Buffer.isBuffer(obj1) && Buffer.isBuffer(obj2)) {
                if (obj1.length != obj2.length) {
                    return {"error" : util.format("Buffers at \"%s\" differ (%s, %s).", path, obj1.toString('hex'), obj2.toString('hex'))};
                }
                for (var i=0; i<obj1.length; i++) {
                    if (obj1[i] != obj2[i]) { return {"error" : util.format("Buffers at \"%s\" differ (%d, %d), (%s, %s).", path, obj1[i], obj2[i], obj1.toString('hex'), obj2.toString('hex'))};}
                }

                return {"equals" : true};
            }

            if (typeof obj1 != 'object' ||
                typeof obj2 != 'object') {
                    if (obj1 != obj2) {
                        return {"error" : util.format("Value at \"%s\" is different (%s, %s).", path, obj1, obj2)};
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
                return {"error" : util.format("Arrays at \"%s\" have different lengths (%j, %j).", path, arr1, arr2)};
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