/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('../ofp.js');
var ofputil = require('../../util.js');

var port = require('../structs/port.js');

var offsetsHeader = ofp.offsets.ofp_header;
var offsets = ofp.offsets.ofp_port_status;

module.exports = {
            "unpack" : function(buffer, offset) {
                    var message = {
                            "header" : {"type" : 'OFPT_PORT_STATUS'},
                            "body" : {}
                        };
                    var warnings = [];

                    var len = buffer.readUInt16BE(offset + offsetsHeader.length, true);

                    if (len != ofp.sizes.ofp_port_status) {
                        return {
                            "error" : {
                                "desc" : util.format('%s message at offset %d has invalid length (%d).', message.header.type, offset, len)
                            }
                        }
                    }

                    var reason = buffer.readUInt8(offset + offsets.reason, true);
                    if (!(ofputil.setEnum(message.body, 'reason', reason, ofp.ofp_port_reason_rev))) {
                        message.body.reason = reason;
                        warnings.push({
                                "desc" : util.format('%s message at offset %d has invalid reason (%d).', message.header.type, offset, reason)
                            });
                    }

                    var desc = port.unpack(buffer, offset + offsets.desc);
                    if ('error' in desc) {
                        return desc;
                    }
                    if ('warnings' in desc) {
                        warnings.concat(desc.warnings);
                    }

                    message.body.desc = desc.port;

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
