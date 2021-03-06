/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('../../ofp.js');

var offsets = ofp.offsets.ofp_queue_prop_header;

module.exports = {
            "unpack" : function(buffer, offset) {
                        var queueProp = {
                                "header" : {"property" : 'OFPQT_NONE'}
                        };

                    var len = buffer.readUInt16BE(offset + offsets.len, true);
                    if (len != ofp.sizes.ofp_queue_prop_header) {
                        return {
                            "error" : {
                                "desc" : util.format('%s queue-prop at offset %d has invalid length (%d).', queueProp.header.property, offset, len),
                            }
                        }
                    }

                    return {
                        "queue-prop" : queueProp,
                        "offset" : offset + len
                    }
            },

            "pack" : function(queueProp, buffer, offset) {
                    buffer.writeUInt16BE(ofp.ofp_queue_properties.OFPQT_NONE, offset + offsets. property, true);
                    buffer.writeUInt16BE(ofp.sizes.ofp_queue_prop_header, offset + offsets.len, true);
                    buffer.fill(0, offset + offsets.pad, offset + offsets.pad + 4);
                    return {
                        offset : offset + ofp.sizes.ofp_queue_prop_header
                    }
            }

}

})();
