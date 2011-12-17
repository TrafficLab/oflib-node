/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */


(function() {

"use strict";

var fs = require('fs');
var path = require('path');
var util = require('util');
var testutil = require('./util.js');

var JSON = require('../lib/json.js');
var Stream = require('../lib/stream.js');


function testStream(file) {
    process.stdout.write('Streaming ' + file + ' ...');

    var test = require(file);

    var streamTest = new Stream(test.bufferLength);

    for (var i = 0; i < test.stream.length; i++) {
        var res = streamTest.process(test.stream[i].data);

        var eq = testutil.objEquals(res, test.stream[i].result);

        if (typeof eq.error !== 'undefined') {
            process.stderr.write(' ERROR.\n');
            process.stderr.write(util.format("At step %d expetcted %j, received %j\n", i, JSON.stringify(test.stream[i].result), JSON.stringify(res)));
            return;
        }
    };

    process.stdout.write(' OK.\n');
}

module.exports = {
    exec: function exec() {
        var dir = path.join(__dirname, '/stream/');
        process.stdout.write('Executing STREAM tests\n');

        var files = [];
        fs.readdirSync(dir).filter(function(file) { return file.endsWith('.js') })
                            .sort()
                            .forEach(function(file) { files.push(dir + file) });

        files.forEach(function(file) {
            testStream(file);
        });


    }
};

})();
