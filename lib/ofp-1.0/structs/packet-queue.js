/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');

var ofp = require('../ofp.js');
var ofputil = require('../../util.js');
var queueProp = require('../structs/queue-prop.js');

var offsets = ofp.offsets.ofp_packet_queue;

module.exports = {
            "struct" : 'packet-queue',

            "unpack" : function(buffer, offset) {
                    var packetQueue = {};
                    var warnings = [];

                    if (buffer.length < offset + ofp.sizes.ofp_packet_queue) {
                        return {
                            "error" : {
                                "desc" : util.format('packet-queue at offset %d has invalid length (%d).', offset, (buffer.length - offset))
                            }
                        }
                    }

                    var len = buffer.readUInt16BE(offset + offsets.len, true);

                    if (len < ofp.sizes.ofp_packet_queue) {
                        return {
                            "error" : {
                                "desc" : util.format('packet-queue at offset %d has invalid length (%d).', offset, (buffer.length - offset))
                            }
                        }
                    }

                    packetQueue.queue_id = buffer.readUInt32BE(offset, true);
                    if (packetQueue.queue_id == ofp.OFPQ_ALL) {
                        warnings.push({"desc" : util.format('packet-queue at offset %d has invalid queue_id (%d).', offset, packetQueue.queue_id)});
                    }

                    packetQueue.properties = [];

                    var pos = offset + offsets.properties;
                    while (pos < offset + len) {
                        var prop = queueProp.unpack(buffer, pos);
                        if ('error' in prop) {
                            return prop;
                        }

                        if ('warnings' in prop) {
                            warnings.concat(prop.warnings);
                        }
                        packetQueue.properties.push(prop['queue-prop']);
                        pos = prop.offset;
                    }

                    if (pos != offset + len) {
                        return {
                            "error" : {
                                "desc" : util.format('queue-prop at offset %d has extra bytes (%d).', offset, (pos - len))
                            }
                        }
                    }

                    if (warnings.length == 0) {
                        return {
                            "packet-queue" : packetQueue,
                            "offset" : offset + len
                        }
                    } else {
                        return {
                            "packet-queue" : packetQueue,
                            "warnings" : warnings,
                            "offset" : offset + len
                        }
                    }
            }
}

})();
