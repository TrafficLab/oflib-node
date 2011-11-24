/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');

var ofp = require('../ofp.js');
var ofputil = require('../../util.js');
var packet = require('../../packet.js');

var offsets = ofp.offsets.ofp_match;

module.exports = {
            "unpack" : function(buffer, offset) {
                        var match = {};
                        var warnings = [];

                        if (buffer.length < offset + ofp.sizes.ofp_match) {
                            return {
                                "error" : {
                                    "desc" : util.format('match at offset %d is too short (%d).', offset, (buffer.length - offset)),
                                    "type" : 'OFPET_BAD_MATCH', "code" : 'OFPBMC_BAD_LEN'
                                }
                            }
                        }

                        var wildcards = buffer.readUInt32BE(offset + offsets.wildcards, true);

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_IN_PORT) == 0) {
                            var in_port = buffer.readUInt16BE(offset + offsets.in_port, true);
                            if (in_port > ofp.ofp_port.OFPP_MAX) {
                                if (in_port == ofp.ofp_port.OFPP_LOCAL) {
                                    match.in_port = 'OFPP_LOCAL';
                                } else {
                                    match.in_port = in_port;
                                    warnings.push({
                                            "desc" : util.format('%s match at offset %d has invalid in_port (%d).', match.header.type, offset, in_port),
                                            "type" : 'OFPET_BAD_MATCH', "code" : 'OFPBMC_BAD_VALUE'
                                        });
                                }
                            } else {
                                match.in_port = in_port;
                            }
                        }

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_DL_SRC) == 0) {
                            match.dl_src = packet.ethToString(buffer, offset + offsets.dl_src);
                        }

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_DL_DST) == 0) {
                            match.dl_dst = packet.ethToString(buffer, offset + offsets.dl_dst);
                        }

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_DL_VLAN) == 0) {
                            var dl_vlan = buffer.readUInt16BE(offset + offsets.dl_vlan, true);
                            if (dl_vlan == ofp.OFP_VLAN_NONE) {
                                match.dl_vlan = 'OFP_VLAN_NONE';
                            } else {
                                match.dl_vlan = dl_vlan;
                            }
                            // TODO: validate
                        }

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_DL_VLAN_PCP) == 0) {
                            match.dl_vlan_pcp = buffer.readUInt8(offset + offsets.dl_vlan_pcp, true);
                            // TODO: validate
                        }

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_DL_TYPE) == 0) {
                            match.dl_type = buffer.readUInt16BE(offset + offsets.dl_type, true);
                        }

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_NW_TOS) == 0) {
                            match.nw_tos = buffer.readUInt8(offset + offsets.nw_tos, true);
                            // TODO: validate
                        }

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_NW_PROTO) == 0) {
                            match.nw_proto = buffer.readUInt8(offset + offsets.nw_proto, true);
                        }

                        var nw_src_mask = (wildcards & ofp.OFPFW_NW_SRC_MASK) >> ofp.OFPFW_NW_SRC_SHIFT;
                        if (nw_src_mask < 32) {
                            if (nw_src_mask > 0) {
                                match.nw_src_mask = nw_src_mask;
                            }
                            match.nw_src = packet.ipv4ToString(buffer, offset + offsets.nw_src, offset + offsets.nw_src + 4);
                        }

                        var nw_dst_mask = (wildcards & ofp.OFPFW_NW_DST_MASK) >> ofp.OFPFW_NW_DST_SHIFT;
                        if (nw_dst_mask < 32) {
                            if (nw_dst_mask > 0) {
                                match.nw_dst_mask = nw_dst_mask;
                            }
                            match.nw_dst = packet.ipv4ToString(buffer, offset + offsets.nw_dst, offset + offsets.nw_dst + 4);
                        }

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_TP_SRC) == 0) {
                            match.tp_src = buffer.readUInt16BE(offset, true);
                        }

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_TP_DST) == 0) {
                            match.tp_dst = buffer.readUInt16BE(offset, true);
                        }

                        if (warnings.length == 0) {
                            return {
                                "match" : match,
                                "offset" : offset + ofp.sizes.ofp_match
                            }
                        } else {
                            return {
                                "match" : match,
                                "warnings" : warnings,
                                "offset" : offset + ofp.sizes.ofp_match
                            }
                        }
            }

}

})();
