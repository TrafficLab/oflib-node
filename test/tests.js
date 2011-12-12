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

function testUnpack(path, module) {
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

        var offset = 42;

        var buf = new Buffer(test.bin.length + offset);
        (new Buffer(test.bin)).copy(buf, offset);

        var unpack = module.unpack(buf, offset);

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
            expect[module.struct] = test.obj;
            expect.offset = test.bin.length + offset;

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

function testPack(path, module) {
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

        var offset = 42;

        var buf = new Buffer(65535);
        var pack = module.pack(test.obj, buf, offset);

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
                if (test.bin.length + offset != pack.offset) {
                    process.stderr.write(' ERROR.\n');
                    process.stderr.write(util.format('Pack length differs (%d, %d).', test.bin.length, pack.offset));
                } else {

                    var res = testutil.bufEquals(buf.slice(offset), new Buffer(test.bin), pack.offset - offset);

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

function testBoth(path, module) {
    testUnpack(path, module);
    testPack(path, module);
}

/* OpenFlow 1.1 */
testBoth('./data-1.1/actions/',                    require('../lib/ofp-1.1/action.js'));
testBoth('./data-1.1/instructions/',               require('../lib/ofp-1.1/instruction.js'));
testBoth('./data-1.1/structs/bucket.js',           require('../lib/ofp-1.1/structs/bucket.js'));
testBoth('./data-1.1/structs/bucket-counter.js',   require('../lib/ofp-1.1/structs/bucket-counter.js'));
testBoth('./data-1.1/structs/flow-stats.js',       require('../lib/ofp-1.1/structs/flow-stats.js'));
testBoth('./data-1.1/structs/group-stats.js',      require('../lib/ofp-1.1/structs/group-stats.js'));
testBoth('./data-1.1/structs/group-desc-stats.js', require('../lib/ofp-1.1/structs/group-desc-stats.js'));
testBoth('./data-1.1/structs/match.js',            require('../lib/ofp-1.1/structs/match.js'));
testBoth('./data-1.1/structs/packet-queue.js',     require('../lib/ofp-1.1/structs/packet-queue.js'));
testBoth('./data-1.1/structs/port.js',             require('../lib/ofp-1.1/structs/port.js'));
testBoth('./data-1.1/structs/port-stats.js',       require('../lib/ofp-1.1/structs/port-stats.js'));
testBoth('./data-1.1/structs/queue-props/',        require('../lib/ofp-1.1/structs/queue-prop.js'));
testBoth('./data-1.1/structs/queue-stats.js',      require('../lib/ofp-1.1/structs/queue-stats.js'));
testBoth('./data-1.1/structs/table-stats.js',      require('../lib/ofp-1.1/structs/table-stats.js'));
testBoth('./data-1.1/messages/',                   require('../lib/ofp-1.1/message.js'));
testBoth('./data-1.1/messages/stats/',             require('../lib/ofp-1.1/message.js'));

/* OpenFlow 1.0 - Unpack */
testUnpack('./data-1.0/actions/',                  require('../lib/ofp-1.0/action.js'));
testUnpack('./data-1.0/structs/flow-stats.js',     require('../lib/ofp-1.0/structs/flow-stats.js'));
testUnpack('./data-1.0/structs/match.js',          require('../lib/ofp-1.0/structs/match.js'));
testUnpack('./data-1.0/structs/packet-queue.js',   require('../lib/ofp-1.0/structs/packet-queue.js'));
testUnpack('./data-1.0/structs/phy-port.js',       require('../lib/ofp-1.0/structs/phy-port.js'));
testUnpack('./data-1.0/structs/port-stats.js',     require('../lib/ofp-1.0/structs/port-stats.js'));
testUnpack('./data-1.0/structs/queue-props/',      require('../lib/ofp-1.0/structs/queue-prop.js'));
testUnpack('./data-1.0/structs/queue-stats.js',    require('../lib/ofp-1.0/structs/queue-stats.js'));
testUnpack('./data-1.0/structs/table-stats.js',    require('../lib/ofp-1.0/structs/table-stats.js'));
testUnpack('./data-1.0/messages/',                 require('../lib/ofp-1.0/message.js'));
testUnpack('./data-1.0/messages/stats/',           require('../lib/ofp-1.0/message.js'));

/* OpenFlow - version independent Unpack */
testUnpack('./data-1.1/messages/',                 require('../lib/oflib.js'));
testUnpack('./data-1.1/messages/stats/',           require('../lib/oflib.js'));
testUnpack('./data-1.0/messages/',                 require('../lib/oflib.js'));
testUnpack('./data-1.0/messages/stats/',           require('../lib/oflib.js'));

/* OpenFlow - version independent Pack */
testPack('./data-1.1/messages/',                   require('../lib/oflib.js'));
testPack('./data-1.1/messages/stats/',             require('../lib/oflib.js'));
