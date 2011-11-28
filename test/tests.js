/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

var fs = require('fs');
var util = require('util');
var testutil = require('./testutil.js');

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function testUnpack(path, name, fun) {
    var files = [];
    if (path.endsWith('/')) {
        fs.readdirSync(path).filter(function(file) { return file.endsWith('.js') })
                            .sort()
                            .forEach(function(file) { files.push(path + file) });
    } else {
        files.push(path);
    }

    files.forEach(function(file) {
        process.stdout.write('Unpacking ' + file + ' ...');

        var test = require(file);

        var unpack = fun(new Buffer(test.bin), 0);

        if ('warnings' in test) {
            // negative testcase for warnings
            if (!('warnings' in unpack)) {
                process.stderr.write(' ERROR.\n');
                process.stderr.write(util.format("Expected \"warnings\", received %j\n", unpack));
            } else {
                process.stdout.write(' OK.\n');
            }

        } else if ('error' in test) {
            // negative testcase for error
            if (!('error' in unpack)) {
                process.stderr.write(' ERROR.\n');
                process.stderr.write(util.format("Expected \"error\", received %j\n", unpack));
            } else {
                process.stdout.write(' OK.\n');
            }

        } else {
            // positive testcase
            var expect = {};
            expect[name] = test.obj;
            expect.offset = test.bin.length;

            if ('error' in unpack) {
                process.stderr.write(' ERROR.\n');
                process.stderr.write(util.format("%j\n", unpack.error));
            } else if ('warnings' in unpack) {
                process.stderr.write(' ERROR.\n');
                process.stderr.write(util.format("%j\n", unpack.warnings));
                //TODO: compare results
            } else {
                var res = testutil.objEquals(unpack, expect);

                if ('error' in res) {
                    process.stderr.write(' ERROR.\n');
                    process.stderr.write(util.format("%j\n", res.error));
                } else {
                    process.stdout.write(' OK.\n');
                }
            }
        }
    });

}

function testPack(path, name, fun) {
    var files = [];
    if (path.endsWith('/')) {
        fs.readdirSync(path).filter(function(file) { return file.endsWith('.js') })
                            .sort()
                            .forEach(function(file) { files.push(path + file) });
    } else {
        files.push(path);
    }

    files.forEach(function(file) {
        process.stdout.write('Packing ' + file + ' ...');

        var test = require(file);

        var buf = new Buffer(65535);
        var pack = fun(test.obj, buf, 0);

        if ('warnings' in test) {
            // negative testcase for warnings
            if (!('warnings' in pack)) {
                process.stderr.write(' ERROR.\n');
                process.stderr.write(util.format("Expected \"warnings\", received %j\n", pack));
                //TODO: compare results
            } else {
                process.stdout.write(' OK.\n');
            }

        } else if ('error' in test) {
            // negative testcase for error
            if (!('error' in pack)) {
                process.stderr.write(' ERROR.\n');
                process.stderr.write(util.format("Expected \"error\", received %j\n", pack));
            } else {
                process.stdout.write(' OK.\n');
            }

        } else {
            // positive testcase

            if ('error' in pack) {
                process.stderr.write(' ERROR.\n');
                process.stderr.write(util.format("%j\n", pack.error));
            } else if ('warnings' in pack) {
                process.stderr.write(' ERROR.\n');
                process.stderr.write(util.format("%j\n", pack.warnings));
            } else {
                if (test.bin.length != pack.offset) {
                    process.stderr.write(' ERROR.\n');
                    process.stderr.write(util.format('Pack length differs (%d, %d).', test.bin.length, pack.offset));
                } else {

                    var res = testutil.bufEquals(buf, new Buffer(test.bin), pack.offset);

                    if ('error' in res) {
                        process.stderr.write(' ERROR.\n');
                        process.stderr.write(util.format("%j\n", res.error));
                    } else {
                        process.stdout.write(' OK.\n');
                    }
                }
            }
        }
    });

}


/* OpenFlow 1.1 - Unpack */
testUnpack('./data-1.1/actions/', 'action', require('../lib/ofp-1.1/action.js').unpack);
testUnpack('./data-1.1/instructions/', 'instruction', require('../lib/ofp-1.1/instruction.js').unpack);
testUnpack('./data-1.1/structs/bucket.js', 'bucket', require('../lib/ofp-1.1/structs/bucket.js').unpack);
testUnpack('./data-1.1/structs/bucket-counter.js', 'bucket-counter', require('../lib/ofp-1.1/structs/bucket-counter.js').unpack);
testUnpack('./data-1.1/structs/group-stats.js', 'group-stats', require('../lib/ofp-1.1/structs/group-stats.js').unpack);
testUnpack('./data-1.1/structs/group-desc-stats.js', 'group-desc-stats', require('../lib/ofp-1.1/structs/group-desc-stats.js').unpack);
testUnpack('./data-1.1/structs/flow-stats.js', 'flow-stats', require('../lib/ofp-1.1/structs/flow-stats.js').unpack);
testUnpack('./data-1.1/structs/match.js', 'match', require('../lib/ofp-1.1/structs/match.js').unpack);
testUnpack('./data-1.1/structs/packet-queue.js', 'packet-queue', require('../lib/ofp-1.1/structs/packet-queue.js').unpack);
testUnpack('./data-1.1/structs/port.js', 'port', require('../lib/ofp-1.1/structs/port.js').unpack);
testUnpack('./data-1.1/structs/port-stats.js', 'port-stats', require('../lib/ofp-1.1/structs/port-stats.js').unpack);
testUnpack('./data-1.1/structs/queue-props/', 'queue-prop', require('../lib/ofp-1.1/structs/queue-prop.js').unpack);
testUnpack('./data-1.1/structs/queue-stats.js', 'queue-stats', require('../lib/ofp-1.1/structs/queue-stats.js').unpack);
testUnpack('./data-1.1/structs/table-stats.js', 'table-stats', require('../lib/ofp-1.1/structs/table-stats.js').unpack);
testUnpack('./data-1.1/messages/', 'message', require('../lib/ofp-1.1/message.js').unpack);
testUnpack('./data-1.1/messages/stats/', 'message', require('../lib/ofp-1.1/message.js').unpack);

/* OpenFlow 1.1 - Pack */
testPack('./data-1.1/actions/', 'action', require('../lib/ofp-1.1/action.js').pack);


/* OpenFlow 1.0 - Unpack */
testUnpack('./data-1.0/actions/', 'action', require('../lib/ofp-1.0/action.js').unpack);
testUnpack('./data-1.0/structs/flow-stats.js', 'flow-stats', require('../lib/ofp-1.0/structs/flow-stats.js').unpack);
testUnpack('./data-1.0/structs/match.js', 'match', require('../lib/ofp-1.0/structs/match.js').unpack);
testUnpack('./data-1.0/structs/packet-queue.js', 'packet-queue', require('../lib/ofp-1.0/structs/packet-queue.js').unpack);
testUnpack('./data-1.0/structs/phy-port.js', 'phy-port', require('../lib/ofp-1.0/structs/phy-port.js').unpack);
testUnpack('./data-1.0/structs/port-stats.js', 'port-stats', require('../lib/ofp-1.0/structs/port-stats.js').unpack);
testUnpack('./data-1.0/structs/queue-props/', 'queue-prop', require('../lib/ofp-1.0/structs/queue-prop.js').unpack);
testUnpack('./data-1.0/structs/queue-stats.js', 'queue-stats', require('../lib/ofp-1.0/structs/queue-stats.js').unpack);
testUnpack('./data-1.0/structs/table-stats.js', 'table-stats', require('../lib/ofp-1.0/structs/table-stats.js').unpack);
testUnpack('./data-1.0/messages/', 'message', require('../lib/ofp-1.0/message.js').unpack);
testUnpack('./data-1.0/messages/stats/', 'message', require('../lib/ofp-1.0/message.js').unpack);

/* OpenFlow - version independent Unpack */
testUnpack('./data-1.1/messages/', 'message', require('../lib/oflib.js').unpack);
testUnpack('./data-1.1/messages/stats/', 'message', require('../lib/oflib.js').unpack);
testUnpack('./data-1.0/messages/', 'message', require('../lib/oflib.js').unpack);
testUnpack('./data-1.0/messages/stats/', 'message', require('../lib/oflib.js').unpack);
