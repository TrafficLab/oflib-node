/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

var util = require('util');

var ofp = require('./ofp.js');
var oflib = require('./oflib.js');

var Stream = function Stream() {
            this.length = 1024;
            this.buffer = new Buffer(1024);
            this.size = 0;
        };

module.exports = Stream;

/*
 * data is a buffer containing data received from the stream
 * Returns: [<result>], where result is either:
 * {"error" : <error text> }, or {"message" : <JSON>}
 */
Stream.prototype.process =  function process(data, offset) {
            if (!offset) { offset = 0; }

            if (this.size == 0) {
                /* nothing is buffered yet */

                if (data.length - offset < ofp.sizes.ofp_header) {
                    /* received packet is too small */
                    data.copy(this.buffer, 0, offset);
                    this.size = data.length - offset;
                    return [];
                }

                var msgSize = data.readUInt16BE(offset + ofp.offsets.ofp_header.length, true);

                if (data.length - offset < msgSize) {
                    /* must wait for the rest of the message */
                    data.copy(this.buffer, 0, offset);
                    this.size = data.length - offset;
                    return [];
                }

                if (data.length - offset == msgSize) {
                    return [oflib.unpack(data, offset)];
                }

                /* data.length - offset > msgSize */
                var result = [oflib.unpack(data, offset)];

                /* Note: recursive call, internal data will be changed */
                var moreResult = this.process(data, offset + msgSize);
                return result.concat(moreResult);

            } else {
                /* already has something buffered - must add received data, and handle together */
                if (data.length - offset > 0) {
                    if (this.length < this.size + data.length - offset) {
                        // buffer is not big enough
                        do {
                            this.length *= 2;
                        } while (this.length < this.size + data.length - offset);
                        var newBuffer = new Buffer(this.length);
                        this.buffer.copy(newBuffer, 0, 0, this.size);
                        this.buffer = newBuffer;
                    }

                    data.copy(this.buffer, this.size, offset);
                    this.size += data.length - offset;
                }

                if (this.size < ofp.sizes.ofp_header) {
                    /* need to wait more */
                    return [];
                }

                var msgSize = this.buffer.readUInt16BE(offset + + ofp.offsets.ofp_header.length, true);

                if (this.size < msgSize) {
                    return [];
                }

                if (this.size == msgSize) {
                    this.size = 0;
                    return [oflib.unpack(this.buffer, 0)];
                }

                /* data.length - offset > msgSize */
                var result = [oflib.unpack(this.buffer, 0)];

                this.size -= msgSize;
                this.buffer.copy(this.buffer, 0, msgSize, msgSize + this.size);

                /* Note: recursive call, internal data will be changed */
                var moreResult = this.process(EMPTY_BUFFER, 0);
                return result.concat(moreResult);
            }
        }


Stream.prototype.EMPTY_BUFFER = new Buffer(0);