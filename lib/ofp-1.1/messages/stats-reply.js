/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('../ofp.js');
var ofputil = require('../../util.js');

var aggregate = require('./stats/aggregate-reply.js');
var desc = require('./stats/desc-reply.js');
var experimenter = require('./stats/experimenter-reply.js');
var flow = require('./stats/flow-reply.js');
var groupDesc = require('./stats/group-desc-reply.js');
var group = require('./stats/group-reply.js');
var port = require('./stats/port-reply.js');
var queue = require('./stats/queue-reply.js');
var table = require('./stats/table-reply.js');

var offsetsHeader = ofp.offsets.ofp_header;
var offsets = ofp.offsets.ofp_stats_reply;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var message = {
                            "header" : {"type" : 'OFPT_STATS_REPLY'}
                        };
                    var warnings = [];

                    var len = buffer.readUInt16BE(offset + offsetsHeader.length, true);

                    if (len < ofp.sizes.ofp_stats_reply) {
                        return {
                            "error" : {
                                "desc" : util.format('%s message at offset %d has invalid length (%d).', message.header.type, offset, len)
                            }
                        }
                    }

                    var type = buffer.readUInt16BE(offset + offsets.type, true);

                    switch (type) {
                        case ofp.ofp_stats_types.OFPST_DESC: { var unpack = desc.unpack(buffer, offset); break; }
                        case ofp.ofp_stats_types.OFPST_FLOW: { var unpack = flow.unpack(buffer, offset); break; }
                        case ofp.ofp_stats_types.OFPST_AGGREGATE: { var unpack = aggregate.unpack(buffer, offset); break; }
                        case ofp.ofp_stats_types.OFPST_TABLE: { var unpack = table.unpack(buffer, offset); break; }
                        case ofp.ofp_stats_types.OFPST_PORT: { var unpack = port.unpack(buffer, offset); break; }
                        case ofp.ofp_stats_types.OFPST_QUEUE: { var unpack = queue.unpack(buffer, offset); break; }
                        case ofp.ofp_stats_types.OFPST_GROUP: { var unpack = group.unpack(buffer, offset); break; }
                        case ofp.ofp_stats_types.OFPST_GROUP_DESC: { var unpack = groupDesc.unpack(buffer, offset); break; }
                        case ofp.ofp_stats_types.OFPST_EXPERIMENTER: { var unpack = experimenter.unpack(buffer, offset); break; }
                        default: {
                            return {
                                "error" : {
                                    "desc" : util.format('%s message at offset %d has invalid type (%d).', message.header.type, offset, type)
                                }
                             }
                        }
                    }

                    if ('error' in unpack) {
                        return unpack;
                    }
                    if ('warnings' in unpack) {
                        warnings.concat(unpack.warnings);
                    }
                    message.body = unpack.stats;


                    var flags = buffer.readUInt16BE(offset + offsets.flags, true);
                    var flagsParsed = ofputil.parseFlags(flags, ofp.ofp_stats_reply_flags);
                    if (flagsParsed.remain != 0) {
                        message.body.header.flags = flags;
                        warnings.push({
                                "desc" : util.format('%s message at offset %d has invalid flags (%d).', message.header.type, offset, flags)
                        });
                    }
                    message.body.header.flags = flagsParsed.array;

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

                        if (buffer.length < offset + ofp.sizes.ofp_stats_reply) {
                            return {
                                error : { desc : util.format('%s message at offset %d does not fit the buffer.', offset, message.header.type)}
                            }
                        }

                        buffer.writeUInt8(ofp.ofp_type.OFPT_STATS_REPLY, offset + offsetsHeader.type, true);

                        switch (message.body.header.type) {
                            case 'OFPST_DESC': { var pack = desc.pack(message.body, buffer, offset); break; }
                            case 'OFPST_FLOW': { var pack = flow.pack(message.body, buffer, offset); break; }
                            case 'OFPST_AGGREGATE': { var pack = aggregate.pack(message.body, buffer, offset); break; }
                            case 'OFPST_TABLE': { var pack = table.pack(message.body, buffer, offset); break; }
                            case 'OFPST_PORT': { var pack = port.pack(message.body, buffer, offset); break; }
                            case 'OFPST_QUEUE': { var pack = queue.pack(message.body, buffer, offset); break; }
                            case 'OFPST_GROUP': { var pack = group.pack(message.body, buffer, offset); break; }
                            case 'OFPST_GROUP_DESC': { var pack = groupDesc.pack(message.body, buffer, offset); break; }
                            case 'OFPST_EXPERIMENTER': { var pack = experimenter.pack(message.body, buffer, offset); break; }
                            default: {
                                return {
                                    error : {
                                        desc : util.format('unknown message at %d (%s).', offset, message.header.type)
                                    }
                                }
                            }
                        }

                        if ('warnings' in pack) {
                            warnings = pack.warnings;
                        }

                        buffer.writeUInt16BE(ofp.ofp_stats_types[message.body.header.type], offset + offsets.type, true);

                        var flags = 0;
                        message.body.header.flags.forEach(function(f) {
                            if (f in ofp.ofp_stats_reply_flags) {
                                flags |= ofp.ofp_stats_reply_flags[f];
                            } else {
                                warnings.push({desc : util.format('%s message at offset %d has invalid flag (%s).', message.header.type, offset, f)})
                            }
                        });

                        buffer.writeUInt16BE(flags, offset + offsets.flags, true);
                        buffer.fill(0, offset + offsets.pad, offset + offsets.pad + 4);

                        if (warnings.length == 0) {
                            return {
                                offset : pack.offset
                            }
                        } else {
                            return {
                                warnings : warnings,
                                offset : pack.offset
                            }
                        }
        }

}

})();
