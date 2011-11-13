/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('../ofp.js');

var offsetsHeader = ofp.offsets.ofp_header;
var offsets = ofp.offsets.ofp_table_mod;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var message = {
                            "header" : {"type" : 'OFPT_TABLE_MOD'},
                            "body" : {}
                        };
                    var warnings = [];

                    var len = buffer.readUInt16BE(offset + offsetsHeader.length, true);

                    if (len != ofp.sizes.ofp_table_mod) {
                        return {
                            "error" : {
                                "desc" : util.format('%s message at offset %d has invalid length (%d).', message.header.type, offset, len),
                                "type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'
                            }
                        }
                    }

                    var table_id = buffer.readUInt8(offset + offsets.table_id, true);
                    if (table_id == ofp.ofp_table.OFPTT_ALL) {
                        message.body.table_id = 'OFPTT_ALL';
                    } else {
                        message.body.table_id = table_id;
                    }

                    var config = buffer.readUInt32BE(offset + offsets.config, true);

                    switch (config & ofp.ofp_table_config.OFPTC_TABLE_MISS_MASK) {
                        case ofp.ofp_table_config.OFPTC_TABLE_MISS_CONTROLLER: {
                            message.body.config = 'OFPTC_TABLE_MISS_CONTROLLER';
                            break;
                        }
                        case ofp.ofp_table_config.OFPTC_TABLE_MISS_CONTINUE: {
                            message.body.config = 'OFPTC_TABLE_MISS_CONTINUE';
                            break;
                        }
                        case ofp.ofp_table_config.OFPTC_TABLE_MISS_DROP: {
                            message.body.config = 'OFPTC_TABLE_MISS_DROP';
                            break;
                        }
                        default: {
                            message.body.config = config;
                            warnings.push({
                                    "desc" : util.format('%s message at offset %d has invalid config (%d).', message.header.type, offset, config),
                                    "type" : 'OFPET_TABLE_MOD_FAILED', "code" : 'OFPTMFC_BAD_CONFIG'
                                });
                        }
                    }

                    if (config > ofp.ofp_table_config.OFPTC_TABLE_MISS_MASK) {
                        warnings.push({
                                "desc" : util.format('%s message at offset %d has invalid config (%d).', message.header.type, offset, config),
                                "type" : 'OFPET_TABLE_MOD_FAILED', "code" : 'OFPTMFC_BAD_CONFIG'
                            });
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


