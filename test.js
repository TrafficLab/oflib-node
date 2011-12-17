#!/usr/bin/env node

var ALL_TESTS = ['oflib', 'stream'];

var tests;
if (process.argv.length > 2) {
    tests = process.argv.slice(2);
} else {
    tests = ALL_TESTS;
}

tests.forEach(function(test) {
    var module = require('./test/' + test + '.js');
    module.exec();
});
