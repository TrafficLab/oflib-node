/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');

var ofp = require('../ofp.js');

var offsets = ofp.offsets.ofp_bucket_counter;

module.exports = {
            "struct" : 'bucket-counter',

            "unpack" : function(buffer, offset) {
                    var bucketCounter = {};

                    if (buffer.length < ofp.sizes.ofp_bucket_counter) {
                        return {
                            "error" : {
                                "desc" : util.format('bucket-counter at offset %d has invalid length (%d).', offset, len)
                            }
                        }
                    }

                    bucketCounter.packet_count = [buffer.readUInt32BE(offset + offsets.packet_count, true),
                                                  buffer.readUInt32BE(offset + offsets.packet_count + 4, true)];

                    bucketCounter.byte_count = [buffer.readUInt32BE(offset + offsets.byte_count, true),
                                                buffer.readUInt32BE(offset + offsets.byte_count + 4, true)];

                    return {
                        "bucket-counter" : bucketCounter,
                        "offset" : offset + ofp.sizes.ofp_bucket_counter
                    };
            },

            "pack" : function(bucketCounter, buffer, offset) {

                    if (buffer.length < offset + ofp.sizes.ofp_bucket_counter) {
                        return {
                            error : { desc : util.format('bucket-counter at offset %d does not fit the buffer.', offset)}
                        }
                    }

                    buffer.writeUInt32BE(bucketCounter.packet_count[0], offset + offsets.packet_count, true);
                    buffer.writeUInt32BE(bucketCounter.packet_count[1], offset + offsets.packet_count + 4, true);

                    buffer.writeUInt32BE(bucketCounter.byte_count[0], offset + offsets.byte_count, true);
                    buffer.writeUInt32BE(bucketCounter.byte_count[1], offset + offsets.byte_count + 4, true);

                    return {
                        offset : offset + ofp.sizes.ofp_bucket_counter
                    }

            }


}

})();
