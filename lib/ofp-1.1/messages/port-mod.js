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
            },

            "pack" : function(message, buffer, offset) {
                    var warnings = [];

                    if (buffer.length < offset + ofp.sizes.ofp_port_mod) {
                        return {
                            error : { desc : util.format('%s message at offset %d does not fit the buffer.', message.header.type, offset)}
                        }
                    }

                    buffer.writeUInt8(ofp.ofp_type.OFPT_PORT_MOD, offset + offsetsHeader.type, true);
                    buffer.writeUInt16BE(ofp.sizes.ofp_port_mod, offset + offsetsHeader.length, true);

                    buffer.writeUInt32BE(message.body.port_no, offset + offsets.port_no, true);
                    if (message.body.port_no > ofp.ofp_port_no.OFPP_MAX) {
                        warnings.push({desc: util.formt('%s message at offset %d hs invalid port_no (%s).', message.header.type, offset, message.body.port_no)});
                    }

                    buffer.fill(0, offset + offsets.pad, offset + offsets.pad + 4);

                    packet.stringToEth(message.body.hw_addr, buffer, offset + offsets.hw_addr);
                    buffer.fill(0, offset + offsets.pad2, offset + offsets.pad2 + 2);

                    var config = 0;
                    var mask = 0;

                    message.body.config_set.forEach(function(flag) {
                        if (flag in ofp.ofp_port_config) {
                            config |= ofp.ofp_port_config[flag];
                            mask   |= ofp.ofp_port_config[flag];
                        } else {
                            warnings.push({desc: util.formt('%s message at offset %d hs invalid config_set flag (%s).', message.header.type, offset, flag)});
                        }
                    });

                    message.body.config_unset.forEach(function(flag) {
                        if (flag in ofp.ofp_port_config) {
                            mask |= ofp.ofp_port_config[flag];
                        } else {
                            warnings.push({desc: util.formt('%s message at offset %d hs invalid config_unset flag (%s).', message.header.type, offset, flag)});
                        }
                    });

                    buffer.writeUInt32BE(config, offset + offsets.config, true);
                    buffer.writeUInt32BE(mask, offset + offsets.mask, true);

                    var advertise = 0;

                    message.body.advertise.forEach(function(flag) {
                        if (flag in ofp.ofp_port_features) {
                            advertise |= ofp.ofp_port_features[flag];
                        } else {
                            warnings.push({desc: util.formt('%s message at offset %d hs invalid advertise flag (%s).', message.header.type, offset, flag)});
                        }
                    });

                    buffer.writeUInt32BE(advertise, offset + offsets.advertise, true);
                    buffer.fill(0, offset + offsets.pad3, offset + offsets.pad3 + 4);

                    if (warnings.length == 0) {
                        return {
                            offset : offset + ofp.sizes.ofp_port_mod
                        }
                    } else {
                        return {
                            warnings : warnigns,
                            offset : offset + ofp.sizes.ofp_port_mod
                        }
                    }
            }

}

})();
