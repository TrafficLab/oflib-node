/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

(function() {

"use strict";

var fs = require('fs');
var path = require('path');
var util = require('util');
var testutil = require('./util.js');

function listFiles(filePath) {
    if (filePath.endsWith('/')) {
        var files = [];
        fs.readdirSync(path.join(__dirname, filePath)).filter(function(file) { return file.endsWith('.js') })
                            .sort()
                            .forEach(function(file) { files.push(filePath + file) });
        return files;
    } else {
        return [path.join(__dirname, filePath)];
    }
}

function testUnpack(filePath, module) {

    listFiles(filePath).forEach(function(file) {
        process.stdout.write('Unpacking ' + file + ' ...');

        var test = require(file);

        var offset = 42;

        var buf = new Buffer(test.bin.length + offset);
        (new Buffer(test.bin)).copy(buf, offset);

        var unpack = module.unpack(buf, offset);

        if (typeof test.warnings !== 'undefined') {
            // negative testcase for warnings
            if (typeof unpack.warnings === 'undefined') {
                process.stderr.write(' ERROR.\n');
                process.stderr.write(util.format("Expected \"warnings\", received %j\n", unpack));
            } else {
                process.stdout.write(' OK.\n');
            }

        } else if (typeof test.error !== 'undefined') {
            // negative testcase for error
            if (typeof unpack.error === 'undefined') {
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

            if (typeof unpack.error !== 'undefined') {
                process.stderr.write(' ERROR.\n');
                process.stderr.write(util.format("%j\n", unpack.error));
            } else if (typeof unpack.warnings !== 'undefined') {
                process.stderr.write(' ERROR.\n');
                process.stderr.write(util.format("%j\n", unpack.warnings));
                //TODO: compare results
            } else {
                var res = testutil.objEquals(unpack, expect);

                if (typeof res.error !== 'undefined') {
                    process.stderr.write(' ERROR.\n');
                    process.stderr.write(util.format("%j\n", res.error));
                } else {
                    process.stdout.write(' OK.\n');
                }
            }
        }
    });

}

function testPack(filePath, module) {
    listFiles(filePath).forEach(function(file) {
        process.stdout.write('Packing ' + file + ' ...');

        var test = require(file);

        var offset = 42;

        var buf = new Buffer(65535);
        var pack = module.pack(test.obj, buf, offset);

        if (typeof test.warnings !== 'undefined') {
            // negative testcase for warnings
            if (typeof pack.warnings === 'undefined') {
                process.stderr.write(' ERROR.\n');
                process.stderr.write(util.format("Expected \"warnings\", received %j\n", pack));
                //TODO: compare results
            } else {
                process.stdout.write(' OK.\n');
            }

        } else if (typeof test.error !== 'undefined') {
            // negative testcase for error
            if (typeof pack.error === 'undefined') {
                process.stderr.write(' ERROR.\n');
                process.stderr.write(util.format("Expected \"error\", received %j\n", pack));
            } else {
                process.stdout.write(' OK.\n');
            }

        } else {
            // positive testcase

            if (typeof pack.error !== 'undefined') {
                process.stderr.write(' ERROR.\n');
                process.stderr.write(util.format("%j\n", pack.error));
            } else if (typeof pack.warnings !== 'undefined') {
                process.stderr.write(' ERROR.\n');
                process.stderr.write(util.format("%j\n", pack.warnings));
            } else {
                if (test.bin.length + offset != pack.offset) {
                    process.stderr.write(' ERROR.\n');
                    process.stderr.write(util.format('Pack length differs (%d, %d).', test.bin.length, pack.offset));
                } else {

                    var res = testutil.bufEquals(buf.slice(offset), new Buffer(test.bin), pack.offset - offset);

                    if (typeof res.error !== 'undefined') {
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

function testBoth(filePath, module) {
    testUnpack(filePath, module);
    testPack(filePath, module);
}


module.exports = {
    exec: function exec() {
        process.stdout.write('Executing OFLIB tests\n');

        /* OpenFlow 1.1 */
        testBoth('./oflib-1.1/actions/',                    require('../lib/ofp-1.1/action.js'));
        testBoth('./oflib-1.1/instructions/',               require('../lib/ofp-1.1/instruction.js'));
        testBoth('./oflib-1.1/structs/bucket.js',           require('../lib/ofp-1.1/structs/bucket.js'));
        testBoth('./oflib-1.1/structs/bucket-counter.js',   require('../lib/ofp-1.1/structs/bucket-counter.js'));
        testBoth('./oflib-1.1/structs/flow-stats.js',       require('../lib/ofp-1.1/structs/flow-stats.js'));
        testBoth('./oflib-1.1/structs/group-stats.js',      require('../lib/ofp-1.1/structs/group-stats.js'));
        testBoth('./oflib-1.1/structs/group-desc-stats.js', require('../lib/ofp-1.1/structs/group-desc-stats.js'));
        testBoth('./oflib-1.1/structs/match.js',            require('../lib/ofp-1.1/structs/match.js'));
        testBoth('./oflib-1.1/structs/packet-queue.js',     require('../lib/ofp-1.1/structs/packet-queue.js'));
        testBoth('./oflib-1.1/structs/port.js',             require('../lib/ofp-1.1/structs/port.js'));
        testBoth('./oflib-1.1/structs/port-stats.js',       require('../lib/ofp-1.1/structs/port-stats.js'));
        testBoth('./oflib-1.1/structs/queue-props/',        require('../lib/ofp-1.1/structs/queue-prop.js'));
        testBoth('./oflib-1.1/structs/queue-stats.js',      require('../lib/ofp-1.1/structs/queue-stats.js'));
        testBoth('./oflib-1.1/structs/table-stats.js',      require('../lib/ofp-1.1/structs/table-stats.js'));
        testBoth('./oflib-1.1/messages/',                   require('../lib/ofp-1.1/message.js'));
        testBoth('./oflib-1.1/messages/stats/',             require('../lib/ofp-1.1/message.js'));

        /* OpenFlow 1.0 - Unpack */
        testUnpack('./oflib-1.0/actions/',                  require('../lib/ofp-1.0/action.js'));
        testUnpack('./oflib-1.0/structs/flow-stats.js',     require('../lib/ofp-1.0/structs/flow-stats.js'));
        testUnpack('./oflib-1.0/structs/match.js',          require('../lib/ofp-1.0/structs/match.js'));
        testUnpack('./oflib-1.0/structs/packet-queue.js',   require('../lib/ofp-1.0/structs/packet-queue.js'));
        testUnpack('./oflib-1.0/structs/phy-port.js',       require('../lib/ofp-1.0/structs/phy-port.js'));
        testUnpack('./oflib-1.0/structs/port-stats.js',     require('../lib/ofp-1.0/structs/port-stats.js'));
        testUnpack('./oflib-1.0/structs/queue-props/',      require('../lib/ofp-1.0/structs/queue-prop.js'));
        testUnpack('./oflib-1.0/structs/queue-stats.js',    require('../lib/ofp-1.0/structs/queue-stats.js'));
        testUnpack('./oflib-1.0/structs/table-stats.js',    require('../lib/ofp-1.0/structs/table-stats.js'));
        testUnpack('./oflib-1.0/messages/',                 require('../lib/ofp-1.0/message.js'));
        testUnpack('./oflib-1.0/messages/stats/',           require('../lib/ofp-1.0/message.js'));

        /* OpenFlow - version independent Unpack */
        testUnpack('./oflib-1.1/messages/',                 require('../lib/oflib.js'));
        testUnpack('./oflib-1.1/messages/stats/',           require('../lib/oflib.js'));
        testUnpack('./oflib-1.0/messages/',                 require('../lib/oflib.js'));
        testUnpack('./oflib-1.0/messages/stats/',           require('../lib/oflib.js'));

        /* OpenFlow - version independent Pack */
        testPack('./oflib-1.1/messages/',                   require('../lib/oflib.js'));
        testPack('./oflib-1.1/messages/stats/',             require('../lib/oflib.js'));

    }
};

})();
