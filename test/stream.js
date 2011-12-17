/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */


(function() {

"use strict";

var events = require('events');
var fs = require('fs');
var path = require('path');
var util = require('util');
var testutil = require('./util.js');

var JSON = require('../lib/json.js');
var Stream = require('../lib/stream.js');


function testProcess(file) {
    process.stdout.write('Stream process ' + file + ' ...');

    var test = require(file);

    var streamTest = new Stream();

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

function testEvent(file) {
    process.stdout.write('Stream event ' + file + ' ...');

    var test = require(file);

    var emitter = new events.EventEmitter();

    var streamTest = new Stream(emitter);

    var emit = test.stream.map(function(s) { return s.data; });
    var expect = [];
    test.stream.forEach(function(s) { expect = expect.concat(s.result) });
    var success = true;

    streamTest.on('error', function(err) {
        process.stderr.write(' ERROR.\n');
        process.stderr.write(util.format("Received %j\n", JSON.stringify(err)));
        success = false;
    });

    streamTest.on('message', function(msg) {
        if (typeof msg.warning !== 'undefined') {
            process.stderr.write(' ERROR.\n');
            process.stderr.write(util.format("Received %j\n", JSON.stringify(err)));
            success = false;
        } else {
            var eq = testutil.objEquals(msg, expect[0]);

            if (typeof eq.error !== 'undefined') {
                process.stderr.write(' ERROR.\n');
                process.stderr.write(util.format("Expetcted %j, received %j\n", JSON.stringify(expect[0]), JSON.stringify(msg)));
                success = false;
            }

            expect = expect.slice(1);
        }
    });

    emit.forEach(function(ev) {
        emitter.emit('data', ev);
    });

    if (success) {
        if (expect.length !== 0) {
            process.stderr.write(' ERROR.\n');
            process.stderr.write(util.format("Expetcted more events %j\n", JSON.stringify(expect)));
        } else {
            process.stdout.write(' OK.\n');
        }
    }
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
            testProcess(file);
            testEvent(file);
        });


    }
};

})();
