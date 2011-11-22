/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('../ofp.js');
var ofputil = require('../../util.js');

var match = require('../structs/match.js');
var action = require('../action.js');

var offsetsHeader = ofp.offsets.ofp_header;
var offsets = ofp.offsets.ofp_flow_mod;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var message = {
                            "header" : {"type" : 'OFPT_FLOW_MOD'},
                            "body" : {}
                        };
                    var warnings = [];

                    var len = buffer.readUInt16BE(offset + offsetsHeader.length, true);

                    if (len < ofp.sizes.ofp_flow_mod) {
                        return {
                            "error" : {
                                "desc" : util.format('%s message at offset %d has invalid length (%d).', message.header.type, offset, len),
                                "type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'
                            }
                        }
                    }

                    var unpack = match.unpack(buffer, offset + offsets.match);
                    if ('error' in unpack) {
                        return unpack;
                    }
                    if ('warnings' in unpack) {
                        warnings.concat(unpack.warnings);
                    }
                    message.body.match = unpack.match;

                    // TODO: Sanity check and remove unused fields vs. command
                    message.body.cookie = new Buffer(8);
                    buffer.copy(message.body.cookie, 0, offset + offsets.cookie, offset + offsets.cookie + 8);

                    var command = buffer.readUInt16BE(offset + offsets.command, true);
                    if(!(ofputil.setEnum(message.body, "command", command, ofp.ofp_flow_mod_command_rev))) {
                        message.body.command = command;
                        warnings.push({
                                    "desc" : util.format('%s message at offset %d has invalid command (%d).', message.header.type, offset, len),
                                    "type" : 'OFPET_FLOW_MOD_FAILED', "code" : 'OFPFMFC_BAD_COMMAND'
                                });
                    }

                    ofputil.setIfNotEq(message.body, "idle_timeout", buffer.readUInt16BE(offset + offsets.idle_timeout, true), 0);
                    ofputil.setIfNotEq(message.body, "hard_timeout", buffer.readUInt16BE(offset + offsets.hard_timeout, true), 0);

                    message.body.priority = buffer.readUInt16BE(offset + offsets.priority, true);

                    ofputil.setIfNotEq(message.body, 'buffer_id', buffer.readUInt32BE(offset + offsets.buffer_id, true), 0xffffffff);

                    var out_port = buffer.readUInt16BE(offset + offsets.out_port, true);
                    if (out_port > ofp.ofp_port.OFPP_MAX) {
                        if (out_port != ofp.ofp_port.OFPP_ANY) {
                            message.body.out_port = out_port;
                            warnings.push({
                                        "desc" : util.format('%s message at offset %d has invalid out_port (%d).', message.header.type, offset, out_port),
                                        "type" : 'OFPET_FLOW_MOD_FAILED', "code" : 'OFPFMFC_BAD_UNKNOWN'
                                    });
                        }
                    } else {
                        message.body.out_port = out_port;
                    }

                    var flags = buffer.readUInt16BE(offset + offsets.flags, true);
                    var flagsParsed = ofputil.parseFlags(flags, ofp.ofp_flow_mod_flags);
                    if (flagsParsed.remain != 0) {
                            warnings.push({
                                        "desc" : util.format('%s message at offset %d has invalid flags (%d).', message.header.type, offset, flags),
                                        "type" : 'OFPET_FLOW_MOD_FAILED', "code" : 'OFPFMFC_UNKNOWN'
                                    });
                    }
                    message.body.flags = flagsParsed.array;


                    message.body.actions = [];

                    // NOTE: ofp_flow_mod does contain a standard match structure!
                    var pos = offset + offsets.actions;
                    while (pos < offset + len) {
                        var unpack = action.unpack(buffer, pos);
                        if ('error' in unpack) {
                            return unpack;
                        }

                        if ('warnings' in unpack) {
                            warnings.concat(unpack.warnings);
                        }
                        message.body.actions.push(unpack.action);
                        pos = unpack.offset;
                    }

                    if (pos != offset + len) {
                        return {
                            "error" : {
                                "desc" : util.format('%s message at offset %d has extra bytes (%d).', message.header.type, offset, (pos - len)),
                                "type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'
                            }
                        }
                    }

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
