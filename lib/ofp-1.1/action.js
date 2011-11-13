/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('./ofp.js');

var copyTtlIn = require('./actions/copy-ttl-in.js');
var copyTtlOut = require('./actions/copy-ttl-out.js');
var decMplsTtl = require('./actions/dec-mpls-ttl.js');
var decNwTtl = require('./actions/dec-nw-ttl.js');
var experimenter = require('./actions/experimenter.js');
var group = require('./actions/group.js');
var output = require('./actions/output.js');
var popMpls = require('./actions/pop-mpls.js');
var popVlan = require('./actions/pop-vlan.js');
var pushMpls = require('./actions/push-mpls.js');
var pushVlan = require('./actions/push-vlan.js');
var setDlSrc = require('./actions/set-dl-src.js');
var setDlDst = require('./actions/set-dl-dst.js');
var setMplsLabel = require('./actions/set-mpls-label.js');
var setMplsTc = require('./actions/set-mpls-tc.js');
var setMplsTtl = require('./actions/set-mpls-ttl.js');
var setNwDst = require('./actions/set-nw-dst.js');
var setNwEcn = require('./actions/set-nw-ecn.js');
var setNwSrc = require('./actions/set-nw-src.js');
var setNwTos = require('./actions/set-nw-tos.js');
var setNwTtl = require('./actions/set-nw-ttl.js');
var setQueue = require('./actions/set-queue.js');
var setTpDst = require('./actions/set-tp-dst.js');
var setTpSrc = require('./actions/set-tp-src.js');
var setVlanPcp = require('./actions/set-vlan-pcp.js');
var setVlanVid = require('./actions/set-vlan-vid.js');

var offsets = ofp.offsets.ofp_action_output;

module.exports = {
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
                                case ofp.ofp_action_type.OFPAT_SET_DL_SRC: { return setDlSrc.unpack(buffer, offset); }
                                case ofp.ofp_action_type.OFPAT_SET_DL_DST: { return setDlDst.unpack(buffer, offset); }
                                case ofp.ofp_action_type.OFPAT_SET_NW_SRC: { return setNwSrc.unpack(buffer, offset); }
                                case ofp.ofp_action_type.OFPAT_SET_NW_DST: { return setNwDst.unpack(buffer, offset); }
                                case ofp.ofp_action_type.OFPAT_SET_NW_TOS: { return setNwTos.unpack(buffer, offset); }
                                case ofp.ofp_action_type.OFPAT_SET_NW_ECN: { return setNwEcn.unpack(buffer, offset); }
                                case ofp.ofp_action_type.OFPAT_SET_TP_SRC: { return setTpSrc.unpack(buffer, offset); }
                                case ofp.ofp_action_type.OFPAT_SET_TP_DST: { return setTpDst.unpack(buffer, offset); }
                                case ofp.ofp_action_type.OFPAT_COPY_TTL_OUT: { return copyTtlOut.unpack(buffer, offset); }
                                case ofp.ofp_action_type.OFPAT_COPY_TTL_IN: { return copyTtlIn.unpack(buffer, offset); }
                                case ofp.ofp_action_type.OFPAT_SET_MPLS_LABEL: { return setMplsLabel.unpack(buffer, offset); }
                                case ofp.ofp_action_type.OFPAT_SET_MPLS_TC: { return setMplsTc.unpack(buffer, offset); }
                                case ofp.ofp_action_type.OFPAT_SET_MPLS_TTL: { return setMplsTtl.unpack(buffer, offset); }
                                case ofp.ofp_action_type.OFPAT_DEC_MPLS_TTL: { return decMplsTtl.unpack(buffer, offset); }
                                case ofp.ofp_action_type.OFPAT_PUSH_VLAN: { return pushVlan.unpack(buffer, offset); }
                                case ofp.ofp_action_type.OFPAT_PUSH_MPLS: { return pushMpls.unpack(buffer, offset); }
                                case ofp.ofp_action_type.OFPAT_POP_VLAN: { return popVlan.unpack(buffer, offset); }
                                case ofp.ofp_action_type.OFPAT_POP_MPLS: { return popMpls.unpack(buffer, offset); }
                                case ofp.ofp_action_type.OFPAT_SET_QUEUE: { return setQueue.unpack(buffer, offset); }
                                case ofp.ofp_action_type.OFPAT_GROUP: { return group.unpack(buffer, offset); }
                                case ofp.ofp_action_type.OFPAT_SET_NW_TTL: { return setNwTtl.unpack(buffer, offset); }
                                case ofp.ofp_action_type.OFPAT_DEC_NW_TTL: { return decNwTtl.unpack(buffer, offset); }
                                case ofp.ofp_action_type.OFPAT_EXPERIMENTER: { return experimenter.unpack(buffer, offset); }
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
