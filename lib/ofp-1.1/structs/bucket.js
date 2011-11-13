/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');

var ofp = require('../ofp.js');
var ofputil = require('../../util.js');
var action = require('../action.js');

var offsets = ofp.offsets.ofp_bucket;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var bucket = {};
                    var warnings = [];

                    if (buffer.length < offset + ofp.sizes.ofp_bucket) {
                        return {
                            "error" : {
                                "desc" : util.format('bucket at offset %d has invalid length (%d).', offset, (buffer.length - offset)),
                                "type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBAC_BAD_LEN'
                            }
                        }
                    }

                    var len = buffer.readUInt16BE(offset + offsets.len, true);

                    if (len < ofp.sizes.ofp_bucket) {
                        return {
                            "error" : {
                                "desc" : util.format('bucket at offset %d has invalid length (%d).', offset, (buffer.length - offset)),
                                "type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBAC_BAD_LEN'
                            }
                        }
                    }

                    ofputil.setIfNotEq(bucket, "weight", buffer.readUInt16BE(offset + offsets.weight, true), 0);

                    var watch_port = buffer.readUInt32BE(offset + offsets.watch_port, true);
                    if (watch_port > ofp.ofp_port_no.OFPP_MAX) {
                        if (watch_port != ofp.ofp_port_no.OFPP_ANY) {
                            bucket.watch_port = watch_port;
                            warnings.push({
                                    "desc" : util.format('bucket at offset %d has invalid watch_port (%d).', offset, watch_port),
                                    "type" : 'OFPET_GROUP_MOD_FAILED', "code" : 'OFPGMFC_INVALID_GROUP'
                                });
                        }
                    } else {
                        bucket.watch_port = watch_port;
                    }

                    var watch_group = buffer.readUInt32BE(offset + offsets.watch_group, true);
                    if (watch_group > ofp.ofp_group.OFPG_MAX) {
                        if (watch_group != ofp.ofp_group.OPFG_ANY) {
                            bucket.watch_group = watch_group;
                            warnings.push({
                                    "desc" : util.format('bucket at offset %d has invalid watch_group (%d).', offset, watch_group),
                                    "type" : 'OFPET_GROUP_MOD_FAILED', "code" : 'OFPGMFC_INVALID_GROUP'
                                });
                        }
                    } else {
                        bucket.watch_group = watch_group;
                    }

                    bucket.actions = [];

                    var pos = offset + offsets.actions;
                    while (pos < offset + len) {
                        var act = action.unpack(buffer, pos);
                        if ('error' in act) {
                            return act;
                        }

                        if ('warnings' in act) {
                            warnings.concat(act.warnings);
                        }
                        bucket.actions.push(act.action);
                        pos = act.offset;
                    }

                    if (pos != offset + len) {
                        return {
                            "error" : {
                                "desc" : util.format('bucket at offset %d has extra bytes (%d).', offset, (pos - len)),
                                "type" : 'OFPET_GROUP_MOD_FAILED', "code" : 'OFPGMFC_INVALID_GROUP'
                            }
                        }
                    }

                    if (warnings.length == 0) {
                        return {
                            "bucket" : bucket,
                            "offset" : offset + len
                        }
                    } else {
                        return {
                            "bucket" : bucket,
                            "warnings" : warnings,
                            "offset" : offset + len
                        }
                    }
            }
}

})();
