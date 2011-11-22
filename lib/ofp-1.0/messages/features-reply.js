/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('../ofp.js');
var ofputil = require('../../util.js');

var phyPort = require('../structs/phy-port.js');

var offsetsHeader = ofp.offsets.ofp_header;
var offsets = ofp.offsets.ofp_switch_features;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var message = {
                            "header" : {"type" : 'OFPT_FEATURES_REPLY'},
                            "body" : {}
                        };
                    var warnings = [];

                    var len = buffer.readUInt16BE(offset + offsetsHeader.length, true);

                    if (len < ofp.sizes.ofp_switch_features) {
                        return {
                            "error" : {
                                "desc" : util.format('%s message at offset %d has invalid length (%d).', message.header.type, offset, len)
                            }
                        }
                    }

                    message.body.datapath_id = buffer.toString('hex', offset + offsets.datapath_id, offset + offsets.datapath_id + 8);
                    message.body.n_buffers = buffer.readUInt32BE(offset + offsets.n_buffers, true);
                    message.body.n_tables = buffer.readUInt8(offset + offsets.n_tables, true);

                    var capabilities = buffer.readUInt32BE(offset + offsets.capabilities, true);
                    var capabilitiesParsed = ofputil.parseFlags(capabilities, ofp.ofp_capabilities);
                    if (capabilitiesParsed.remain != 0) {
                        warnings.push({"desc" : util.format('%s message at offset %d has invalid capabilities (%d).', message.header.type,  offset, capabilities)});
                    }
                    message.body.capabilities = capabilitiesParsed.array;

                    var actions = buffer.readUInt32BE(offset + offsets.actions, true);
                    var actionsParsed = ofputil.parseFlags(actions, ofp.ofp_action_type_flags);
                    message.body.actions = actionsParsed.array;
                    if (actionsParsed.remain != 0) {
                        warnings.push({"desc" : util.format('%s message at offset %d has invalid actions (%d).', message.header.type, offset, actions)});
                    }

                    message.body.ports = [];

                    var pos = offset + offsets.ports;
                    while (pos < offset + len) {
                        var unpack = phyPort.unpack(buffer, pos);
                        if ('error' in unpack) {
                            return unpack;
                        }

                        if ('warnings' in unpack) {
                            warnings.concat(unpack.warnings);
                        }
                        message.body.ports.push(unpack['phy-port']);
                        pos = unpack.offset;
                    }

                    if (pos != offset + len) {
                        return {
                            "error" : {
                                "desc" : util.format('%s message at offset %d has extra bytes (%d).', message.header.type, offset, (pos - len)),
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
