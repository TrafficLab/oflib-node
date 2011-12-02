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

                    portStats.port_no = buffer.readUInt32BE(offset + offsets.port_no, true);

                    if (portStats.port_no > ofp.ofp_port_no.OFPP_MAX) {
                        if (portStats.port_no == ofp.ofp_port_no.OFPP_LOCAL) {
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
                    if (!ofputil.isUint64All(tx_bytes)) {
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
            },

            "pack" : function(portStats, buffer, offset) {
                    var warnings = [];

                    if (buffer.length < offset + ofp.sizes.ofp_port_stats) {
                        return {
                            error : { desc : util.format('bucket-counter at offset %d does not fit the buffer.', offset)}
                        }
                    }

                    //TODO validate
                    if (portStats.port_no == 'OFPP_LOCAL') {
                        var port_no = ofp.ofp_port_no.OFPP_LOCAL;
                    } else {
                        var port_no = portStats.port_no;
                    }
                    buffer.writeUInt32BE(port_no, offset + offsets.port_no, true);

                    buffer.fill(0, offset + offsets.pad, offset + offsets.pad + 4);

                    if ('rx_packets' in portStats) {
                        buffer.writeUInt32BE(portStats.rx_packets[0], offset + offsets.rx_packets, true);
                        buffer.writeUInt32BE(portStats.rx_packets[1], offset + offsets.rx_packets + 4, true);
                    } else {
                        buffer.fill(0xff, offset + offsets.rx_packets, offset + offsets.rx_packets + 8);
                    }

                    if ('tx_packets' in portStats) {
                        buffer.writeUInt32BE(portStats.tx_packets[0], offset + offsets.tx_packets, true);
                        buffer.writeUInt32BE(portStats.tx_packets[1], offset + offsets.tx_packets + 4, true);
                    } else {
                        buffer.fill(0xff, offset + offsets.tx_packets, offset + offsets.tx_packets + 8);
                    }

                    if ('rx_bytes' in portStats) {
                        buffer.writeUInt32BE(portStats.rx_bytes[0], offset + offsets.rx_bytes, true);
                        buffer.writeUInt32BE(portStats.rx_bytes[1], offset + offsets.rx_bytes + 4, true);
                    } else {
                        buffer.fill(0xff, offset + offsets.rx_bytes, offset + offsets.rx_bytes + 8);
                    }

                    if ('tx_bytes' in portStats) {
                        buffer.writeUInt32BE(portStats.tx_bytes[0], offset + offsets.tx_bytes, true);
                        buffer.writeUInt32BE(portStats.tx_bytes[1], offset + offsets.tx_bytes + 4, true);
                    } else {
                        buffer.fill(0xff, offset + offsets.tx_bytes, offset + offsets.tx_bytes + 8);
                    }

                    if ('rx_dropped' in portStats) {
                        buffer.writeUInt32BE(portStats.rx_dropped[0], offset + offsets.rx_dropped, true);
                        buffer.writeUInt32BE(portStats.rx_dropped[1], offset + offsets.rx_dropped + 4, true);
                    } else {
                        buffer.fill(0xff, offset + offsets.rx_dropped, offset + offsets.rx_dropped + 8);
                    }

                    if ('tx_dropped' in portStats) {
                        buffer.writeUInt32BE(portStats.tx_dropped[0], offset + offsets.tx_dropped, true);
                        buffer.writeUInt32BE(portStats.tx_dropped[1], offset + offsets.tx_dropped + 4, true);
                    } else {
                        buffer.fill(0xff, offset + offsets.tx_dropped, offset + offsets.tx_dropped + 8);
                    }

                    if ('rx_errors' in portStats) {
                        buffer.writeUInt32BE(portStats.rx_errors[0], offset + offsets.rx_errors, true);
                        buffer.writeUInt32BE(portStats.rx_errors[1], offset + offsets.rx_errors + 4, true);
                    } else {
                        buffer.fill(0xff, offset + offsets.rx_errors, offset + offsets.rx_errors + 8);
                    }

                    if ('tx_errors' in portStats) {
                        buffer.writeUInt32BE(portStats.tx_errors[0], offset + offsets.tx_errors, true);
                        buffer.writeUInt32BE(portStats.tx_errors[1], offset + offsets.tx_errors + 4, true);
                    } else {
                        buffer.fill(0xff, offset + offsets.tx_errors, offset + offsets.tx_errors + 8);
                    }

                    if ('rx_frame_err' in portStats) {
                        buffer.writeUInt32BE(portStats.rx_frame_err[0], offset + offsets.rx_frame_err, true);
                        buffer.writeUInt32BE(portStats.rx_frame_err[1], offset + offsets.rx_frame_err + 4, true);
                    } else {
                        buffer.fill(0xff, offset + offsets.rx_frame_err, offset + offsets.rx_frame_err + 8);
                    }

                    if ('rx_over_err' in portStats) {
                        buffer.writeUInt32BE(portStats.rx_over_err[0], offset + offsets.rx_over_err, true);
                        buffer.writeUInt32BE(portStats.rx_over_err[1], offset + offsets.rx_over_err + 4, true);
                    } else {
                        buffer.fill(0xff, offset + offsets.rx_over_err, offset + offsets.rx_over_err + 8);
                    }

                    if ('rx_crc_err' in portStats) {
                        buffer.writeUInt32BE(portStats.rx_crc_err[0], offset + offsets.rx_crc_err, true);
                        buffer.writeUInt32BE(portStats.rx_crc_err[1], offset + offsets.rx_crc_err + 4, true);
                    } else {
                        buffer.fill(0xff, offset + offsets.rx_crc_err, offset + offsets.rx_crc_err + 8);
                    }

                    if ('collisions' in portStats) {
                        buffer.writeUInt32BE(portStats.collisions[0], offset + offsets.collisions, true);
                        buffer.writeUInt32BE(portStats.collisions[1], offset + offsets.collisions + 4, true);
                    } else {
                        buffer.fill(0xff, offset + offsets.collisions, offset + offsets.collisions + 8);
                    }

                    return {
                        offset : offset + ofp.sizes.ofp_port_stats
                    }

            }

}

})();
