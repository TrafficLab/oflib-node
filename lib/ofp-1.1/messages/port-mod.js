/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('../ofp.js');
var ofputil = require('../../util.js');
var packet = require('../../packet.js');

var offsetsHeader = ofp.offsets.ofp_header;
var offsets = ofp.offsets.ofp_port_mod;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var message = {
                            "header" : {"type" : 'OFPT_PORT_MOD'},
                            "body" : {}
                        };
                    var warnings = [];

                    var len = buffer.readUInt16BE(offset + offsetsHeader.length, true);

                    if (len != ofp.sizes.ofp_port_mod) {
                        return {
                            "error" : {
                                "desc" : util.format('%s message at offset %d has invalid length (%d).', message.header.type, offset, len),
                                "ofp_error" : {"type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'}
                            }
                        }
                    }

                    message.body.port_no = buffer.readUInt32BE(offset + offsets.port_no, true);
                    if (message.body.port_no > ofp.ofp_port_no.OFPP_MAX) {
                        warnings.push({
                                    "error" : util.format('%s message at offset %d has invalid port_no (%d).', message.header.type, offset, message.body.port_no),
                                    "type" : 'OFPET_PORT_MOD_FAILED', "code" : 'OFPOMFC_BAD_PORT'
                                });
                    }

                    message.body.hw_addr = packet.ethToString(buffer, offset + offsets.hw_addr);

                    var config = buffer.readUInt32BE(offset + offsets.config, true);
                    var mask = buffer.readUInt32BE(offset + offsets.mask, true);

                    var configSetParsed = ofputil.parseFlags((config & mask), ofp.ofp_port_config);
                    if (configSetParsed.remain != 0) {
                        warnings.push({
                            "error" : util.format('%s message at offset %d has invalid config (%d).', message.header.type, offset, config),
                            "type" : 'OFPET_PORT_MOD_FAILED', "code" : 'OFPPMFC_BAD_CONFIG'
                        });
                    }
                    message.body.config_set = configSetParsed.array;

                    var configUnsetParsed = ofputil.parseFlags((~config & mask), ofp.ofp_port_config);
                    if (configUnsetParsed.remain != 0) {
                        warnings.push({
                            "error" : util.format('%s message at offset %d has invalid config (%d).', message.header.type, offset, config),
                            "type" : 'OFPET_PORT_MOD_FAILED', "code" : 'OFPPMFC_BAD_CONFIG'
                        });
                    }
                    message.body.config_unset = configUnsetParsed.array;

                    var advertise = buffer.readUInt32BE(offset + offsets.advertise, true);
                    var advertiseParsed = ofputil.parseFlags(advertise, ofp.ofp_port_features);
                    if (advertiseParsed.remain != 0) {
                        warnings.push({
                            "error" : util.format('%s message at offset %d has invalid advertise (%d).', message.header.type, offset, advertise),
                            "type" : 'OFPET_PORT_MOD_FAILED', "code" : 'OFPPMFC_BAD_ADVERTISE'
                        });
                    }
                    message.body.advertise = advertiseParsed.array;

                    if (warnings.length == 0) {
                        return {
                            "message" : message,
                            "offset" : offset + len
                        }
                    } else {
                        return {
                            "message" : message,
                            "warnings" : warnings,
                            "offset" : offset + len
                        }
                    }
            }

}

})();
