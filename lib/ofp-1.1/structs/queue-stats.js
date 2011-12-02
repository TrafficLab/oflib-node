/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');

var ofp = require('../ofp.js');
var ofputil = require('../../util.js');

var offsets = ofp.offsets.ofp_queue_stats;

module.exports = {
            "struct" : 'queue-stats',

            "unpack" : function(buffer, offset) {
                    var queueStats = {};
                    var warnings = [];

                    if (buffer.length < ofp.sizes.ofp_queue_stats) {
                        return {
                            "error" : {
                                "desc" : util.format('queue-stats at offset %d has invalid length (%d).', offset, len)
                            }
                        }
                    }

                    queueStats.port_no = buffer.readUInt32BE(offset + offsets.port_no, true);

                    if (queueStats.port_no > ofp.ofp_port_no.OFPP_MAX) {
                        if (queueStats.port_no == ofp.ofp_port_no.OFPP_LOCAL) {
                            queueStats.port_no = 'OFPP_LOCAL';
                        } else {
                            warnings.push({"desc" : util.format('queue-stats at offset %d has invalid port_no (%d).', offset, queueStats.port_no)});
                        }
                    }

                    queueStats.queue_id = buffer.readUInt32BE(offset + offsets.queue_id, true);
                    if (queueStats.queue_id > ofp.OFPQ_MAX) {
                        warnings.push({"desc" : util.format('queue-stats at offset %d has invalid queue_id (%d).', offset, queueStats.queue_id)});
                    }

                    var tx_bytes = [buffer.readUInt32BE(offset + offsets.tx_bytes, true),
                                    buffer.readUInt32BE(offset + offsets.tx_bytes + 4, true)];
                    if (!ofputil.isUint64All(tx_bytes)) {
                        queueStats.tx_bytes = tx_bytes;
                    }

                    var tx_packets = [buffer.readUInt32BE(offset + offsets.tx_packets, true),
                                      buffer.readUInt32BE(offset + offsets.tx_packets + 4, true)];
                    if (!ofputil.isUint64All(tx_packets)) {
                        queueStats.tx_packets = tx_packets;
                    }

                    var tx_errors = [buffer.readUInt32BE(offset + offsets.tx_errors, true),
                                     buffer.readUInt32BE(offset + offsets.tx_errors + 4, true)];
                    if (!ofputil.isUint64All(tx_errors)) {
                        queueStats.tx_errors = tx_errors;
                    }

                    if (warnings.length == 0) {
                        return {
                            "queue-stats" : queueStats,
                            "offset" : offset + ofp.sizes.ofp_queue_stats
                        };
                    } else {
                        return {
                            "queue-stats" : queueStats,
                            "warnings" : warnings,
                            "offset" : offset + ofp.sizes.ofp_queue_stats
                        };
                    }
            },

            "pack" : function(queueStats, buffer, offset) {
                    var warnings = [];

                    if (buffer.length < offset + ofp.sizes.ofp_queue_stats) {
                        return {
                            "error" : {
                                "desc" : util.format('queue-stats at offset %d has invalid length (%d).', offset, (buffer.length - offset))
                            }
                        }
                    }

                    //TODO validate
                    if (queueStats.port_no == 'OFPP_LOCAL') {
                        var port_no = ofp.ofp_port_no.OFPP_LOCAL;
                    } else {
                        var port_no = queueStats.port_no;
                    }
                    buffer.writeUInt32BE(port_no, offset + offsets.port_no, true);

                    buffer.writeUInt32BE(queueStats.queue_id, offset + offsets.queue_id, true);
                    if (queueStats.queue_id > ofp.OFPQ_MAX) {
                        warnings.push({"desc" : util.format('queue-stats at offset %d has invalid queue_id (%d).', offset, queueStats.queue_id)});
                    }

                    buffer.writeUInt32BE(queueStats.tx_bytes[0], offset + offsets.tx_bytes, true);
                    buffer.writeUInt32BE(queueStats.tx_bytes[1], offset + offsets.tx_bytes + 4, true);

                    buffer.writeUInt32BE(queueStats.tx_packets[0], offset + offsets.tx_packets, true);
                    buffer.writeUInt32BE(queueStats.tx_packets[1], offset + offsets.tx_packets + 4, true);

                    buffer.writeUInt32BE(queueStats.tx_errors[0], offset + offsets.tx_errors, true);
                    buffer.writeUInt32BE(queueStats.tx_errors[1], offset + offsets.tx_errors + 4, true);

                    if (warnings.length == 0) {
                        return {
                            offset : offset + ofp.sizes.ofp_queue_stats
                        }
                    } else {
                        return {
                            warnings: warnings,
                            offset : offset + ofp.sizes.ofp_queue_stats
                        }
                    }
            }


}

})();
