/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');

var ofp = require('../ofp.js');
var ofputil = require('../../util.js');

var offsets = ofp.offsets.ofp_port_stats;

module.exports = {
            "struct" : 'port-stats',

            "unpack" : function(buffer, offset) {
                    var portStats = {};
                    var warnings = [];

                    if (buffer.length < ofp.sizes.ofp_port_stats) {
                        return {
                            "error" : {
                                "desc" : util.format('port-stats at offset %d has invalid length (%d).', offset, len)
                            }
                        }
                    }

                    portStats.port_no = buffer.readUInt16BE(offset + offsets.port_no, true);

                    if (portStats.port_no > ofp.ofp_port.OFPP_MAX) {
                        if (portStats.port_no == ofp.ofp_port.OFPP_LOCAL) {
                            portStats.port_no = 'OFPP_LOCAL';
                        } else {
                            warnings.push({"desc" : util.format('port-stats at offset %d has invalid port_no (%d).', offset, portStats.port_no)});
                        }
                    }


                    var rx_packets = [buffer.readUInt32BE(offset + offsets.rx_packets , true), buffer.readUInt32BE(offset + offsets.rx_packets + 4, true)];
                    if (!ofputil.isUint64All(rx_packets)) {
                        portStats.rx_packets = rx_packets;
                    }

                    var tx_packets = [buffer.readUInt32BE(offset + offsets.tx_packets, true), buffer.readUInt32BE(offset + offsets.tx_packets + 4, true)];
                    if (!ofputil.isUint64All(tx_packets)) {
                        portStats.tx_packets = tx_packets;
                    }

                    var rx_bytes = [buffer.readUInt32BE(offset + offsets.rx_bytes, true), buffer.readUInt32BE(offset + offsets.rx_bytes + 4, true)];
                    if (!ofputil.isUint64All(rx_bytes)) {
                        portStats.rx_bytes = rx_bytes;
                    }

                    var tx_bytes = [buffer.readUInt32BE(offset + offsets.tx_bytes, true), buffer.readUInt32BE(offset + offsets.tx_bytes + 4, true)];
                    if (!ofputil.isUint64All(tx_bytes) ){
                        portStats.tx_bytes = tx_bytes;
                    }

                    var rx_dropped = [buffer.readUInt32BE(offset + offsets.rx_dropped, true), buffer.readUInt32BE(offset + offsets.rx_dropped + 4, true)];
                    if (!ofputil.isUint64All(rx_dropped)) {
                        portStats.rx_dropped = rx_dropped;
                    }

                    var tx_dropped = [buffer.readUInt32BE(offset + offsets.tx_dropped, true), buffer.readUInt32BE(offset + offsets.tx_dropped + 4, true)];
                    if (!ofputil.isUint64All(tx_dropped)) {
                        portStats.tx_dropped = tx_dropped;
                    }

                    var rx_errors = [buffer.readUInt32BE(offset + offsets.rx_errors, true), buffer.readUInt32BE(offset + offsets.rx_errors + 4, true)];
                    if (!ofputil.isUint64All(rx_errors)) {
                        portStats.rx_errors = rx_errors;
                    }

                    var tx_errors = [buffer.readUInt32BE(offset + offsets.tx_errors, true), buffer.readUInt32BE(offset + offsets.tx_errors + 4, true)];
                    if (!ofputil.isUint64All(tx_errors)) {
                        portStats.tx_errors = tx_errors;
                    }

                    var rx_frame_err = [buffer.readUInt32BE(offset + offsets.rx_frame_err, true), buffer.readUInt32BE(offset + offsets.rx_frame_err + 4, true)];
                    if (!ofputil.isUint64All(rx_frame_err)) {
                        portStats.rx_frame_err = rx_frame_err;
                    }

                    var rx_over_err = [buffer.readUInt32BE(offset + offsets.rx_over_err, true), buffer.readUInt32BE(offset + offsets.rx_over_err + 4, true)];
                    if (!ofputil.isUint64All(rx_over_err)) {
                        portStats.rx_over_err = rx_over_err;
                    }

                    var rx_crc_err = [buffer.readUInt32BE(offset + offsets.rx_crc_err, true), buffer.readUInt32BE(offset + offsets.rx_crc_err + 4, true)];
                    if (!ofputil.isUint64All(rx_crc_err)) {
                        portStats.rx_crc_err = rx_crc_err;
                    }

                    var collisions = [buffer.readUInt32BE(offset + offsets.collisions, true), buffer.readUInt32BE(offset + offsets.collisions + 4, true)];
                    if (!ofputil.isUint64All(collisions)) {
                        portStats.collisions = collisions;
                    }

                    if (warnings.length == 0) {
                        return {
                            "port-stats" : portStats,
                            "offset" : offset + ofp.sizes.ofp_port_stats
                        };

                    } else {
                        return {
                            "port-stats" : portStats,
                            "warnings" : warnings,
                            "offset" : offset + ofp.sizes.ofp_port_stats
                        };
                    }
            }

}

})();
