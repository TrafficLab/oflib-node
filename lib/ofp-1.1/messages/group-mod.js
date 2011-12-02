/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('../ofp.js');
var ofputil = require('../../util.js');

var bucket = require('../structs/bucket.js');

var offsetsHeader = ofp.offsets.ofp_header;
var offsets = ofp.offsets.ofp_group_mod;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var message = {
                            "header" : {"type" : 'OFPT_GROUP_MOD'},
                            "body" : {}
                        };
                    var warnings = [];

                    // TODO: experimenter

                    var len = buffer.readUInt16BE(offset + offsetsHeader.length, true);

                    if (len < ofp.sizes.ofp_group_mod) {
                        return {
                            "error" : {
                                "desc" : util.format('%s message at offset %d has invalid length (%d).', message.header.type, offset, len),
                                "type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'
                            }
                        }
                    }

                    // TODO: Sanity check and remove unused fields vs. command
                    var command =  buffer.readUInt16BE(offset + offsets.command, true);
                    if (!ofputil.setEnum(message.body, 'command', command, ofp.ofp_group_mod_command_rev)) {
                        message.body.command = command;
                        warnings.push({
                            "desc" : util.format('%s message at offset %d has invalid command (%d).', message.header.type, offset, command),
                            "type" : 'OFPET_GROUP_MOD_FAILED', "code" : 'OFPGMFC_INVALID_GROUP'
                        });
                    }

                    var type =  buffer.readUInt8(offset + offsets.type, true)
                    if (!ofputil.setEnum(message.body, 'type', type, ofp.ofp_group_type_rev)) {
                        message.body.type = type;
                        warnings.push({
                            "desc" : util.format('Received %s message at offset %d has invalid type (%d).', message.header.type, offset, type),
                            "type" : 'OFPET_GROUP_MOD_FAILED', "code" : 'OFPGMFC_INVALID_GROUP'
                        });
                    }

                    var group_id = buffer.readUInt32BE(offset + offsets.group_id, true);
                    if (group_id > ofp.ofp_group.OFPG_MAX) {
                        if (group_id == ofp.ofp_group.OFPG_ALL) {
                            message.body.group_id = 'OFPG_ALL';
                        } else {
                            message.body.group_id = group_id;
                            warnings.push({
                                "desc" : util.format('Received %s message at offset %d has invalid group_id (%d).', message.header.type, offset, group_id),
                                "type" : 'OFPET_GROUP_MOD_FAILED', "code" : 'OFPGMFC_UNKNOWN_GROUP'
                            });
                        }
                    } else {
                        message.body.group_id = group_id;
                    }


                    message.body.buckets = [];

                    var pos = offset + offsets.buckets;
                    while (pos < offset + len) {
                        var unpack = bucket.unpack(buffer, pos);
                        if ('error' in unpack) {
                            return unpack;
                        }

                        if ('warnings' in unpack) {
                            warnings.concat(unpack.warnings);
                        }
                        message.body.buckets.push(unpack.bucket);
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
            },

            "pack" : function(message, buffer, offset) {
                    var warnings = [];

                    if (buffer.length < offset + ofp.sizes.ofp_group_mod) {
                        return {
                            error : { desc : util.format('%s message at offset %d does not fit the buffer.', message.header.type, offset)}
                        }
                    }

                    buffer.writeUInt8(ofp.ofp_type.OFPT_GROUP_MOD, offset + offsetsHeader.type, true);

                    if (message.body.command in ofp.ofp_group_mod_command) {
                        var command = ofp.ofp_group_mod_command[message.body.command];
                    } else {
                        var command = 0;
                        warnings.push({desc : util.format('%s message at offset %d has invalid command (%d).', message.header.type, offset, command)});
                    }
                    buffer.writeUInt16BE(command, offset + offsets.command, true);

                    if (message.body.type in ofp.ofp_group_type) {
                        type = ofp.ofp_group_type[message.body.type];
                    } else {
                        var type = 0;
                        warnings.push({desc : util.format('Received %s message at offset %d has invalid type (%d).', message.header.type, offset, type)})
                    }
                    buffer.writeUInt8(type,offset + offsets.type, true);
                    buffer.fill(0, offset + offsets.pad, offset + offsets.pad + 1);

                    // TODO: validate
                    if (message.body.group_id == 'OFPG_ALL') {
                        var group_id = ofp.ofp_group.OFPG_ALL;
                    } else {
                        var group_id = message.body.group_id;
                    }
                    buffer.writeUInt32BE(group_id, offset + offsets.group_id, true);

                    var pos = offset + offsets.buckets;
                    message.body.buckets.forEach(function(b) {
                        var pack = bucket.pack(b, buffer, pos);

                        if ('error' in pack) {
                            return pack;
                        }
                        if ('warnings' in pack) {
                            warnings.concat(pack.warnings);
                        }

                        pos = pack.offset;
                    });

                    buffer.writeUInt16BE(pos, offset + offsetsHeader.length, true);

                    if (warnings.length == 0) {
                        return {
                            offset : pos
                        }
                    } else {
                        return {
                            warnings: warnings,
                            offset : pos
                        }
                    }
            }


}

})();
