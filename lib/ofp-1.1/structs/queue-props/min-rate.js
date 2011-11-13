/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('../../ofp.js');

var offsetsHeader = ofp.offsets.ofp_queue_prop_header;
var offsets = ofp.offsets.ofp_queue_prop_min_rate;

module.exports = {
            "unpack" : function(buffer, offset) {
                        var queueProp = {
                                "header" : {"property" : 'OFPQT_MIN_RATE'},
                                "body" : {}
                        };

                    var len = buffer.readUInt16BE(offset + offsetsHeader.len, true);
                    if (len != ofp.sizes.ofp_queue_prop_min_rate) {
                        return {
                            "error" : {
                                "desc" : util.format('%s queue-prop at offset %d has invalid length (%d).', queueProp.header.property, offset, len),
                            }
                        }
                    }

                    var rate = buffer.readUInt16BE(offset + offsets.rate, true);
                    if (rate <= 1000) {
                        queueProp.body.rate = rate;
                    }

                    return {
                        "queue-prop" : queueProp,
                        "offset" : offset + len
                    }
            }

}

})();
