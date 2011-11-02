#!/bin/sh

find test/test-*.js | xargs -n 1 -t node $1