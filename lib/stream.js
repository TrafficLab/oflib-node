/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

var events = require('events');
var util = require('util');

var ofp = require('./ofp.js');
var oflib = require('./oflib.js');

var Stream = function Stream(stream, event) {
    this.buffer = new Buffer(1024);
    this.size = 0;

    if (typeof stream !== 'undefined') {
        if (typeof event === 'undefined') { event = 'data' }
        this.listen(stream, event);
    }
};

Stream.prototype = new events.EventEmitter();

Stream.prototype.listen = function listen(stream, event) {

    var self = this;

    stream.on(event, function(data) {
        var res = self.process(data, 0);
        res.forEach(function(r) {
            if (typeof r.error !== 'undefined') {
                self.emit('error', r);
            } else if (typeof r.message !== 'undefined') {
                self.emit('message', r);
            }
        });
    });
};

Stream.prototype.ensureBuffer = function ensureBuffer(size) {
    var newLength, newBuffer;

    if (this.length < size) {
        newLength = this.length;
        // buffer is not big enough
        do {
            newLength *= 2;
        } while (newLength < size);

        newBuffer = new Buffer(newLength);
        this.buffer.copy(newBuffer, 0, 0, this.size);
        this.buffer = newBuffer;
    }
};

/*
 * data is a buffer containing data received from the stream
 * Returns: [<result>], where result is either:
 * {"error" : <error text> }, or {"message" : <JSON>}
 *
 * NOTE: uses non-tailrecursive calls
 */
Stream.prototype.process = function process(data, offset) {
    if (typeof offset === 'undefined') { offset = 0; }

    if (this.size === 0) {
        return this.processEmpty(data, offset);
    } else {
        return this.processBuffered(data, offset);
    }
};

Stream.prototype.processEmpty = function processEmpty(data, offset) {
    var dataSize, msgSize, result;

    dataSize = data.length - offset;

    if (dataSize < ofp.sizes.ofp_header) {
        /* received packet is too small */
        data.copy(this.buffer, 0, offset);
        this.size = dataSize;
        return [];
    }

    msgSize = data.readUInt16BE(offset + ofp.offsets.ofp_header.length, true);

    if (dataSize < msgSize) {
        this.ensureBuffer(msgSize);

        /* must wait for the rest of the message */
        data.copy(this.buffer, 0, offset);
        this.size = dataSize;
        return [];
    }

    result = oflib.unpack(data, offset);
    delete result.offset;

    if (data.length - offset === msgSize) {
        return [result];
    }

    /* data.length - offset > msgSize */
    return [result].concat(this.processEmpty(data, offset + msgSize));
};

Stream.prototype.processBuffered = function processBuffered(data, offset) {
    var dataSize, msgSize, msgDataSize, result;

    dataSize = data.length - offset;

    // TODO: msgSize could be cached on first read
    msgSize = this.buffer.readUInt16BE(ofp.offsets.ofp_header.length, true);

    msgDataSize = msgSize - this.size;

    if (dataSize < msgDataSize) {
        // need to wait further (buffer is already ensured)
        data.copy(this.buffer, this.size, offset);
        this.size += dataSize;
        return [];
    }

    // copy rest of the message to buffer (buffer is already ensured)
    data.copy(this.buffer, this.size, offset, offset + msgSize - this.size);

    result = oflib.unpack(this.buffer, 0);
    delete result.offset;

    this.size = 0;

    if (dataSize === msgDataSize) {
        return [result];
    }

    // more messages arrived
    return [result].concat(this.processEmpty(data, offset + msgDataSize));
};

module.exports = Stream;
