/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('./ofp.js');

var enqueue = require('./actions/enqueue.js');
var output = require('./actions/output.js');
var setDlSrc = require('./actions/set-dl-src.js');
var setDlDst = require('./actions/set-dl-dst.js');
var setNwDst = require('./actions/set-nw-dst.js');
var setNwSrc = require('./actions/set-nw-src.js');
var setNwTos = require('./actions/set-nw-tos.js');
var setTpDst = require('./actions/set-tp-dst.js');
var setTpSrc = require('./actions/set-tp-src.js');
var setVlanPcp = require('./actions/set-vlan-pcp.js');
var setVlanVid = require('./actions/set-vlan-vid.js');
var stripVlan = require('./actions/strip-vlan.js');
var vendor = require('./actions/vendor.js');

var offsets = ofp.offsets.ofp_action_output;

module.exports = {
            "struct" : 'action',

            "unpack" : function(buffer, offset) {

                            if (buffer.length < offset + ofp.sizes.ofp_action_header) {
                                return {
                                    "error" : {
                                        "desc" : util.format('action at offset %d is too short (%d).', offset, (buffer.length - offset)),
                                        "type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'
                                    }
                                }
                            }

                            // Note: (len % 8 == 0) should be true
                            var len  = buffer.readUInt16BE(offset+ offsets.len, true);

                            if (buffer.length < offset + len) {
                                return {
                                    "error" : {
                                        "desc" : util.format('action at offset %d has invalid length (set to %d, but only %d received).', offset, len, (buffer.length - offset)),
                                        "type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'
                                    }
                                }
                            }

                            var type = buffer.readUInt16BE(offset + offsets.type, true);

                            switch (type) {
                                case ofp.ofp_action_type.OFPAT_OUTPUT: { return output.unpack(buffer, offset); }
                                case ofp.ofp_action_type.OFPAT_SET_VLAN_VID: { return setVlanVid.unpack(buffer, offset); }
                                case ofp.ofp_action_type.OFPAT_SET_VLAN_PCP: { return setVlanPcp.unpack(buffer, offset); }
                                case ofp.ofp_action_type.OFPAT_STRIP_VLAN : { return stripVlan.unpack(buffer, offset); }
                                case ofp.ofp_action_type.OFPAT_SET_DL_SRC: { return setDlSrc.unpack(buffer, offset); }
                                case ofp.ofp_action_type.OFPAT_SET_DL_DST: { return setDlDst.unpack(buffer, offset); }
                                case ofp.ofp_action_type.OFPAT_SET_NW_SRC: { return setNwSrc.unpack(buffer, offset); }
                                case ofp.ofp_action_type.OFPAT_SET_NW_DST: { return setNwDst.unpack(buffer, offset); }
                                case ofp.ofp_action_type.OFPAT_SET_NW_TOS: { return setNwTos.unpack(buffer, offset); }
                                case ofp.ofp_action_type.OFPAT_SET_TP_SRC: { return setTpSrc.unpack(buffer, offset); }
                                case ofp.ofp_action_type.OFPAT_SET_TP_DST: { return setTpDst.unpack(buffer, offset); }
                                case ofp.ofp_action_type.OFPAT_ENQUEUE: { return enqueue.unpack(buffer, offset); }
                                case ofp.ofp_action_type.OFPAT_VENDOR: { return vendor.unpack(buffer, offset); }
                                default: {
                                    return {
                                        "error" : {
                                            "desc" : util.format('action at offset %d has invalid type (%d).', offset, type),
                                            "type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_TYPE'
                                        }
                                    }
                                }
                            }
                    }

}

})();
