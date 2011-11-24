/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('../ofp.js');
var packet = require('../../packet.js');
var ofputil = require('../../util.js');

var offsets = ofp.offsets.ofp_port;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var port = {};
                    var warnings = [];

                    if (buffer.length < ofp.sizes.ofp_port) {
                        return {
                            "error" : {
                                "desc" : util.format('port at offset %d has invalid length (%d).', offset, len),
                            }
                        }
                    }

                    port.port_no = buffer.readUInt32BE(offset + offsets.port_no, true);

                    if (port.port_no > ofp.ofp_port_no.OFPP_MAX) {
                        if (port.port_no == ofp.ofp_port_no.OFPP_LOCAL) {
                            port.port_no = 'OFPP_LOCAL';
                        } else {
                            warnings.push({"desc" : util.format('port at offset %d has invalid port_no (%d).', offset, port.port_no)});
                        }
                    }

                    port.hw_addr = packet.ethToString(buffer, offset + offsets.hw_addr);

                    port.name = buffer.toString('utf8', offset + offsets.name, offset + offsets.name + ofp.OFP_MAX_PORT_NAME_LEN);
                    port.name = port.name.substr(0, port.name.indexOf('\0'));

                    var config = buffer.readUInt32BE(offset + offsets.config, true);
                    var configParsed = ofputil.parseFlags(config, ofp.ofp_port_config);
                    port.config = configParsed.array;
                    if (configParsed.remain != 0) {
                        warnings.push({"desc" : util.format('port at offset %d has invalid config (%d).', offset, config)});
                    }

                    var state = buffer.readUInt32BE(offset + offsets.state, true);
                    var stateParsed = ofputil.parseFlags(state, ofp.ofp_port_state);
                    port.state = stateParsed.array;
                    if (stateParsed.remain != 0) {
                        warnings.push({"desc" : util.format('port at offset %d has invalid state (%d).', offset, state)});
                    }

                    var curr = buffer.readUInt32BE(offset + offsets.curr, true);
                    if (curr != 0) {
                        var currParsed = ofputil.parseFlags(curr, ofp.ofp_port_features);
                        port.curr = currParsed.array;
                        if (currParsed.remain != 0) {
                            warnings.push({"desc" : util.format('port at offset %d has invalid curr (%d).', offset, curr)});
                        }
                    }

                    var advertised = buffer.readUInt32BE(offset + offsets.advertised, true);
                    if (advertised != 0) {
                        var advertisedParsed = ofputil.parseFlags(advertised, ofp.ofp_port_features);
                        port.advertised = advertisedParsed.array;
                        if (advertisedParsed.remain != 0) {
                            warnings.push({"desc" : util.format('port at offset %d has invalid advertised (%d).', offset, advertised)});
                        }
                    }

                    var supported = buffer.readUInt32BE(offset + offsets.supported, true);
                    if (supported != 0) {
                        var supportedParsed = ofputil.parseFlags(supported, ofp.ofp_port_features);
                        port.supported = supportedParsed.array;
                        if (supportedParsed.remain != 0) {
                            warnings.push({"desc" : util.format('port at offset %d has invalid supported (%d).', offset, supported)});
                        }
                    }

                    var peer = buffer.readUInt32BE(offset + offsets.peer, true);
                    if (peer != 0) {
                        var peerParsed = ofputil.parseFlags(peer, ofp.ofp_port_features);
                        port.peer = peerParsed.array;
                        if (peerParsed.remain != 0) {
                            warnings.push({"desc" : util.format('port at offset %d has invalid peer (%d).', offset, peer)});
                        }
                    }

                    port.curr_speed = buffer.readUInt32BE(offset + offsets.curr_speed, true);
                    port.max_speed  = buffer.readUInt32BE(offset + offsets.max_speed, true);

                    if (warnings.length == 0) {
                        return {
                            "port" : port,
                            "offset" : offset + ofp.sizes.ofp_port
                        };

                    } else {
                        return {
                            "port" : port,
                            "warnings" : warnings,
                            "offset" : offset + ofp.sizes.ofp_port
                        };
                    }
            }

}

})();
