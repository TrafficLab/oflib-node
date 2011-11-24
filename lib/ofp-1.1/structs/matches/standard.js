/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');

var ofp = require('../../ofp.js');
var ofputil = require('../../../util.js');
var packet = require('../../../packet.js');

var offsets = ofp.offsets.ofp_match;

module.exports = {
            "unpack" : function(buffer, offset) {
                        var match = {
                                "header" : {"type" : 'OFPMT_STANDARD'},
                                "body" : {}
                        };
                        var warnings = [];

                        var len = buffer.readUInt16BE(offset + offsets.length, true);
                        if (len != ofp.sizes.ofp_match) {
                                return {
                                    "error" : {
                                        "desc" : util.format('%s match at offset %d is too short (%d).', match.header.type, offset, (buffer.length - offset)),
                                        "type" : 'OFPET_BAD_MATCH', "code" : 'OFPBMC_BAD_LEN'
                                    }
                                }
                        }

                        var wildcards = buffer.readUInt32BE(offset + offsets.wildcards, true);

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_IN_PORT) == 0) {
                            var in_port = buffer.readUInt32BE(offset + offsets.in_port, true);
                            if (in_port > ofp.ofp_port_no.OFPP_MAX) {
                                if (in_port == ofp.ofp_port_no.OFPP_LOCAL) {
                                    match.body.in_port = 'OFPP_LOCAL';
                                } else {
                                    match.body.in_port = in_port;
                                    warnings.push({
                                            "desc" : util.format('%s match at offset %d has invalid in_port (%d).', match.header.type, offset, in_port),
                                            "type" : 'OFPET_BAD_MATCH', "code" : 'OFPBMC_BAD_VALUE'
                                        });
                                }
                            } else {
                                match.body.in_port = in_port;
                            }
                        }


                        if (!packet.isEthAll(buffer, offset + offsets.dl_src_mask)) {
                            if (!packet.isEthNone(buffer, offset + offsets.dl_src_mask)) {
                                match.body.dl_src_mask = packet.ethToString(buffer, offset + offsets.dl_src_mask);
                            }
                            match.body.dl_src = packet.ethToString(buffer, offset + offsets.dl_src);
                        }

                        if (!packet.isEthAll(buffer, offset + offsets.dl_dst_mask)) {
                            if (!packet.isEthNone(buffer, offset + offsets.dl_dst_mask)) {
                                match.body.dl_dst_mask = packet.ethToString(buffer, offset + offsets.dl_dst_mask);
                            }
                            match.body.dl_dst = packet.ethToString(buffer, offset + offsets.dl_dst);
                        }

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_DL_VLAN) == 0) {
                            dl_vlan = buffer.readUInt16BE(offset + offsets.dl_vlan, true);
                            if (dl_vlan == ofp.OFP_VLAN_NONE) {
                                match.body.dl_vlan = 'OFP_VLAN_NONE';
                            } else {
                                match.body.dl_vlan = dl_vlan;
                            }
                            // TODO: validate
                        }

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_DL_VLAN_PCP) == 0) {
                            match.body.dl_vlan_pcp = buffer.readUInt8(offset + offsets.dl_vlan_pcp, true);
                            // TODO: validate
                        }

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_DL_TYPE) == 0) {
                            match.body.dl_type = buffer.readUInt16BE(offset + offsets.dl_type, true);
                        }

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_NW_TOS) == 0) {
                            match.body.nw_tos = buffer.readUInt8(offset + offsets.nw_tos, true);
                            // TODO: validate
                        }

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_NW_PROTO) == 0) {
                            match.body.nw_proto = buffer.readUInt8(offset + offsets.nw_proto, true);
                        }

                        if (!packet.isIPv4All(buffer, offset + offsets.nw_src_mask)) {
                            if (!packet.isIPv4None(buffer, offset + offsets.nw_src_mask)) {
                                match.body.nw_src_mask = packet.ipv4ToString(buffer, offset + offsets.nw_src_mask);
                            }
                            match.body.nw_src = packet.ipv4ToString(buffer, offset + offsets.nw_src);
                        }

                        if (!packet.isIPv4All(buffer, offset + offsets.nw_dst_mask)) {
                            if (!packet.isIPv4None(buffer, offset + offsets.nw_dst_mask)) {
                                match.body.nw_dst_mask = packet.ipv4ToString(buffer, offset + offsets.nw_dst_mask);
                            }
                            match.body.nw_dst = packet.ipv4ToString(buffer, offset + offsets.nw_dst);
                        }

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_TP_SRC) == 0) {
                            match.body.tp_src = buffer.readUInt16BE(offset, true);
                        }

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_TP_DST) == 0) {
                            match.body.tp_dst = buffer.readUInt16BE(offset, true);
                        }

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_MPLS_LABEL) == 0) {
                            match.body.mpls_label = buffer.readUInt32BE(offset, true);
                            // TODO : validate
                        }

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_MPLS_TC) == 0) {
                            match.body.mpls_tc = buffer.readUInt8(offset, true);
                            // TODO : validate
                        }


                        var metadata_mask = [buffer.readUInt32BE(offset + offsets.metadata_mask, true),
                                             buffer.readUInt32BE(offset + offsets.metadata_mask + 4, true)];
                        if (!ofputil.isUint64All(metadata_mask)) {
                            if (!ofputil.isUint64None(metadata_mask)) {
                                match.body.metadata_mask = new Buffer(8);
                                buffer.copy(match.body.metadata_mask, 0, offset + offsets.metadata_mask, offset + offsets.metadata_mask + 8);
                            }
                            match.body.metadata = new Buffer(8);
                            buffer.copy(match.body.metadata, 0, offset + offsets.metadata, offset + offsets.metadata + 8);
                        }

                        if (warnings.length == 0) {
                            return {
                                "match" : match,
                                "offset" : offset + len
                            }
                        } else {
                            return {
                                "match" : match,
                                "warnings" : warnings,
                                "offset" : offset + len
                            }
                        }
            }

}

})();
