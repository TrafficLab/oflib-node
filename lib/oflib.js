/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

var util = require('util');

var ofp = require('./ofp.js');
var msg10 = require('./ofp-1.0/message.js');
var msg11 = require('./ofp-1.1/message.js');

module.exports = {
        struct : 'message',

        unpack : function(buffer, offset) {
                        if (typeof offset === "undefined") { offset = 0; }

                        var version = buffer.readUInt8(offset + ofp.offsets.ofp_header.version, true);

                        switch (version) {
                            case 0x01: { return msg10.unpack(buffer, offset); }
                            case 0x02: { return msg11.unpack(buffer, offset); }
                            default: {
                                return {
                                    error : {
                                        desc : util.format('message at offset %d has unsupported version (%d).', offset, version)
                                    }
                                }
                            }
                        }
                },

        pack : function(message, buffer, offset) {
                        if (typeof offset === "undefined") { offset = 0; }

                        switch (message.version) {
                            case '1.1': { return msg11.pack(message, buffer, offset); }
                            default: {
                                return {
                                    error : {
                                        desc : util.format('message at offset %d has unsupported version (%s).', offset, message.header.version)
                                    }
                                }
                            }
                        }
                },
}
