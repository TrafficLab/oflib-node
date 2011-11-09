/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

var fs = require('fs');
var util = require('util');
var testutil = require('./testutil.js');
var oflib = require('../lib/oflib.js');

function testUnpack(name, prefix, fun) {
    console.log('Testing unpack ' + name + '.');

    var testCases = fs.readdirSync('./test/data').filter(function(n) { return n.indexOf(prefix) == 0; }).sort();

    /* cwd is in root dir */
    testCases.forEach(function(test) {
        console.log(test + ' ...');
        var testInput = require('./data/' + test);

        var unpack = fun(new Buffer(testInput.bin), 0);

        if ('error' in testInput) {
            // negative testcase
            if (!('error' in unpack)) {
                console.error(util.format('Expected "error", received %j', unpack));
            } else {
                console.log("OK.");
            }

        } else {
            // positive testcase
            var expect = {};
            expect[name] = testInput.obj;
            expect.offset = testInput.bin.length;

            if ('error' in unpack) {
                console.error(unpack.error);
            } else {
                var res = testutil.objEquals(unpack, expect);
                if ('error' in res) {
                    console.error(res.error);
                } else {
                    console.log("OK.");
                }
            }
        }
    });
}

testUnpack('action', 'action', oflib.unpackAction);
testUnpack('instruction', 'instruction', oflib.unpackInstruction);
testUnpack('message', 'message', oflib.unpackMessage);
testUnpack('bucket', 'struct-bucket.', oflib.unpackStruct.bucket);
testUnpack('bucket-counter', 'struct-bucketCounter', oflib.unpackStruct.bucketCounter);
testUnpack('match', 'struct-match', oflib.unpackStruct.match);
testUnpack('port', 'struct-port.', oflib.unpackStruct.port);
testUnpack('flow-stats', 'struct-flowStats', oflib.unpackStruct.flowStats);
testUnpack('group-stats', 'struct-groupStats', oflib.unpackStruct.groupStats);
testUnpack('group-desc-stats', 'struct-groupDescStats', oflib.unpackStruct.groupDescStats);
testUnpack('table-stats', 'struct-tableStats', oflib.unpackStruct.tableStats);
testUnpack('port-stats', 'struct-portStats', oflib.unpackStruct.portStats);
testUnpack('queue-stats', 'struct-queueStats', oflib.unpackStruct.queueStats);
testUnpack('queue-prop', 'struct-queueProp', oflib.unpackStruct.queueProp);
testUnpack('packet-queue', 'struct-packetQueue', oflib.unpackStruct.packetQueue);
