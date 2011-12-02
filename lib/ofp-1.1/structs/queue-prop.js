/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('../ofp.js');

var none = require('./queue-props/none.js');
var minRate = require('./queue-props/min-rate.js');

var offsets = ofp.offsets.ofp_queue_prop_header;

module.exports = {
            "struct" : 'queue-prop',

            "unpack" : function(buffer, offset) {

                            if (buffer.length < offset + ofp.sizes.ofp_queue_prop_header) {
                                return {
                                    "error" : {
                                        "desc" : util.format('queue-prop at offset %d is too short (%d).', offset, (buffer.length - offset)),
                                    }
                                }
                            }

                            var len = buffer.readUInt16BE(offset + offsets.len, true);

                            if (buffer.length < offset + len) {
                                return {
                                    "error" : {
                                        "desc" : util.format('queue-prop at offset %d has invalid length (set to %d, but only %d received).', offset, len, (buffer.length - offset)),
                                    }
                                }
                            }

                            var property = buffer.readUInt16BE(offset + offsets.property, true);

                            switch (property) {
                                case ofp.ofp_queue_properties.OFPQT_NONE: { return none.unpack(buffer, offset); }
                                case ofp.ofp_queue_properties.OFPQT_MIN_RATE: { return minRate.unpack(buffer, offset); }
                                default: {
                                    return {
                                        "error" : {
                                            "desc" : util.format('queue-prop at offset %d has invalid property (%d).', offset, property),
                                        }
                                    }
                                }
                            }
                    },

            "pack" : function(queueProp, buffer, offset) {
                        if (buffer.length < offset + ofp.sizes.ofp_queue_prop_header) {
                            return {
                                error : { desc : util.format('queue-prop at offset %d does not fit the buffer.', offset)}
                            }
                        }

                        switch (queueProp.header.property) {
                            case 'OFPQT_NONE': { return none.pack(queueProp, buffer, offset); }
                            case 'OFPQT_MIN_RATE': { return minRate.pack(queueProp, buffer, offset); }
                            default: {
                                return {
                                    "error" : {
                                        "desc" : util.format('unknown queue-prop at %d (%s).', offset, queueProp.header.property)
                                    }
                                }
                            }
                        }

            }


}

})();
