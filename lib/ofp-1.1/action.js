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

var unpack = {};
unpack[ofp.ofp_action_type.OFPAT_OUTPUT]          = output.unpack;
unpack[ofp.ofp_action_type.OFPAT_SET_VLAN_VID]    = setVlanVid.unpack;
unpack[ofp.ofp_action_type.OFPAT_SET_VLAN_PCP]    = setVlanPcp.unpack;
unpack[ofp.ofp_action_type.OFPAT_SET_DL_SRC]      = setDlSrc.unpack;
unpack[ofp.ofp_action_type.OFPAT_SET_DL_DST]      = setDlDst.unpack;
unpack[ofp.ofp_action_type.OFPAT_SET_NW_SRC]      = setNwSrc.unpack;
unpack[ofp.ofp_action_type.OFPAT_SET_NW_DST]      = setNwDst.unpack;
unpack[ofp.ofp_action_type.OFPAT_SET_NW_TOS]      = setNwTos.unpack;
unpack[ofp.ofp_action_type.OFPAT_SET_NW_ECN]      = setNwEcn.unpack;
unpack[ofp.ofp_action_type.OFPAT_SET_TP_SRC]      = setTpSrc.unpack;
unpack[ofp.ofp_action_type.OFPAT_SET_TP_DST]      = setTpDst.unpack;
unpack[ofp.ofp_action_type.OFPAT_COPY_TTL_OUT]    = copyTtlOut.unpack;
unpack[ofp.ofp_action_type.OFPAT_COPY_TTL_IN]     = copyTtlIn.unpack;
unpack[ofp.ofp_action_type.OFPAT_SET_MPLS_LABEL]  = setMplsLabel.unpack;
unpack[ofp.ofp_action_type.OFPAT_SET_MPLS_TC]     = setMplsTc.unpack;
unpack[ofp.ofp_action_type.OFPAT_SET_MPLS_TTL]    = setMplsTtl.unpack;
unpack[ofp.ofp_action_type.OFPAT_DEC_MPLS_TTL]    = decMplsTtl.unpack;
unpack[ofp.ofp_action_type.OFPAT_PUSH_VLAN]       = pushVlan.unpack;
unpack[ofp.ofp_action_type.OFPAT_PUSH_MPLS]       = pushMpls.unpack;
unpack[ofp.ofp_action_type.OFPAT_POP_VLAN]        = popVlan.unpack;
unpack[ofp.ofp_action_type.OFPAT_POP_MPLS]        = popMpls.unpack;
unpack[ofp.ofp_action_type.OFPAT_SET_QUEUE]       = setQueue.unpack;
unpack[ofp.ofp_action_type.OFPAT_GROUP]           = group.unpack;
unpack[ofp.ofp_action_type.OFPAT_SET_NW_TTL]      = setNwTtl.unpack;
unpack[ofp.ofp_action_type.OFPAT_DEC_NW_TTL]      = decNwTtl.unpack;
unpack[ofp.ofp_action_type.OFPAT_EXPERIMENTER]    = experimenter.unpack;

var pack = {
    OFPAT_OUTPUT          : output.pack,
    OFPAT_SET_VLAN_VID    : setVlanVid.pack,
    OFPAT_SET_VLAN_PCP    : setVlanPcp.pack,
    OFPAT_SET_DL_SRC      : setDlSrc.pack,
    OFPAT_SET_DL_DST      : setDlDst.pack,
    OFPAT_SET_NW_SRC      : setNwSrc.pack,
    OFPAT_SET_NW_DST      : setNwDst.pack,
    OFPAT_SET_NW_TOS      : setNwTos.pack,
    OFPAT_SET_NW_ECN      : setNwEcn.pack,
    OFPAT_SET_TP_SRC      : setTpSrc.pack,
    OFPAT_SET_TP_DST      : setTpDst.pack,
    OFPAT_COPY_TTL_OUT    : copyTtlOut.pack,
    OFPAT_COPY_TTL_IN     : copyTtlIn.pack,
    OFPAT_SET_MPLS_LABEL  : setMplsLabel.pack,
    OFPAT_SET_MPLS_TC     : setMplsTc.pack,
    OFPAT_SET_MPLS_TTL    : setMplsTtl.pack,
    OFPAT_DEC_MPLS_TTL    : decMplsTtl.pack,
    OFPAT_PUSH_VLAN       : pushVlan.pack,
    OFPAT_PUSH_MPLS       : pushMpls.pack,
    OFPAT_POP_VLAN        : popVlan.pack,
    OFPAT_POP_MPLS        : popMpls.pack,
    OFPAT_SET_QUEUE       : setQueue.pack,
    OFPAT_GROUP           : group.pack,
    OFPAT_SET_NW_TTL      : setNwTtl.pack,
    OFPAT_DEC_NW_TTL      : decNwTtl.pack,
    OFPAT_EXPERIMENTER    : experimenter.pack,
};

var offsets = ofp.offsets.ofp_action_output;

module.exports = {
    struct : 'action',

    unpack : function(buffer, offset) {
        if (buffer.length < offset + ofp.sizes.ofp_action_header) {
            return {
                error : {
                    desc : util.format('action at offset %d is too short (%d).', offset, (buffer.length - offset)),
                    type : 'OFPET_BAD_ACTION', code : 'OFPBAC_BAD_LEN'
                }
            };
        }

        // Note: (len % 8 == 0) should be true
        var len = buffer.readUInt16BE(offset+ offsets.len, true);

        if (buffer.length < offset + len) {
            return {
                error : {
                    desc : util.format('action at offset %d has invalid length (set to %d, but only %d received).', offset, len, (buffer.length - offset)),
                    type : 'OFPET_BAD_ACTION', code : 'OFPBAC_BAD_LEN'
                }
            };
        }

        var type = buffer.readUInt16BE(offset + offsets.type, true);

        var unpacked;

        if (typeof unpack[type] !== 'undefined') {
            unpacked = (unpack[type])(buffer, offset);
        } else {
            return {
                error : {
                    desc : util.format('action at offset %d has invalid type (%d).', offset, type),
                    type : 'OFPET_BAD_ACTION', code : 'OFPBAC_BAD_TYPE'
                }
            };
        }

        return unpacked;
    },

    pack : function(action, buffer, offset) {
        if (buffer.length < offset + ofp.sizes.ofp_action_header) {
            return {
                error : { desc : util.format('action at offset %d does not fit the buffer.', offset)}
            };
        }

        var type = action.header.type;

        var packed;

        if (typeof pack[type] !== 'undefined') {
            packed = (pack[type])(action, buffer, offset);
        } else {
            return {
                error : {
                    desc : util.format('unknown action at %d (%s).', offset, action.header.type)
                }
            };
        }

        return packed;
    }

};

}());
