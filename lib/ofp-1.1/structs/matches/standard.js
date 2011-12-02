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
            },


            "pack" : function(match, buffer, offset) {
                        var warnings = [];

                        if (buffer.length < offset + ofp.sizes.ofp_match) {
                            return {
                                error : { desc : util.format('match at offset %d does not fit the buffer.', offset)}
                            }
                        }

                        buffer.writeUInt16BE(ofp.ofp_match_type.OFPMT_STANDARD, offset + offsets.type, true);
                        buffer.writeUInt16BE(ofp.sizes.ofp_match, offset + offsets.length, true);

                        var wildcards = 0;

                        // TODO validate
                        if ('in_port' in match.body) {
                            if (match.body.in_port == 'OFPP_LOCAL') {
                                var in_port = ofp.ofp_port_no.OFPP_LOCAL;
                            } else {
                                var in_port = match.body.in_port;
                            }
                        } else {
                            wildcards != ofp.ofp_clow_wildcards.OFPFW_IN_PORT;
                            var in_port = 0;
                        }
                        buffer.writeUInt32BE(in_port, offset + offsets.in_port, true);

                        if ('dl_src' in match.body) {
                            if ('dl_src_mask' in match.body) {
                                packet.stringToEth(match.body.dl_src_mask, buffer, offset + offsets.dl_src_mask);
                            } else {
                                buffer.fill(0x00, offset + offsets.dl_src_mask, offset + offsets.dl_src_mask + ofp.OFP_ETH_ALEN); // TODO fill ?
                            }
                            packet.stringToEth(match.body.dl_src, buffer, offset + offsets.dl_src);
                        } else {
                            buffer.fill(0x00, offset + offsets.dl_src, offset + offsets.dl_src + ofp.OFP_ETH_ALEN); // TODO fill ?
                            buffer.fill(0xff, offset + offsets.dl_src_mask, offset + offsets.dl_src_mask + ofp.OFP_ETH_ALEN); // TODO fill ?
                        }

                        if ('dl_dst' in match.body) {
                            if ('dl_dst_mask' in match.body) {
                                packet.stringToEth(match.body.dl_dst_mask, buffer, offset + offsets.dl_dst_mask);
                            } else {
                                buffer.fill(0x00, offset + offsets.dl_dst_mask, offset + offsets.dl_dst_mask + ofp.OFP_ETH_ALEN); // TODO fill ?
                            }
                            packet.stringToEth(match.body.dl_dst, buffer, offset + offsets.dl_dst);
                        } else {
                            buffer.fill(0x00, offset + offsets.dl_dst, offset + offsets.dl_dst + ofp.OFP_ETH_ALEN); // TODO fill ?
                            buffer.fill(0xff, offset + offsets.dl_dst_mask, offset + offsets.dl_dst_mask + ofp.OFP_ETH_ALEN); // TODO fill ?
                        }

                        if ('dl_vlan' in match.body) {
                            if (match.body.dl_vlan == 'OFP_VLAN_NONE') {
                                var dl_vlan = ofp.OFP_VLAN_NONE;
                            } else {
                                var dl_vlan = match.body.dl_vlan;
                            }
                        } else {
                            var dl_vlan = 0;
                            wildcards |= ofp.ofp_flow_wildcards.OFPFW_DL_VLAN;
                        }
                        buffer.writeUInt16BE(dl_vlan, offset + offsets.dl_vlan, true);

                        if ('dl_vlan_pcp' in match.body) {
                            var dl_vlan_pcp = macth.body.dl_vlan_pcp;
                        } else {
                            var dl_vlan_pcp = 0;
                            wildcards |= ofp.ofp_flow_wildcards.OFPFW_DL_VLAN_PCP;
                        }
                        buffer.writeUInt8(dl_vlan_pcp, offset + offsets.dl_vlan_pcp, true);

                        buffer.fill(0, offset + offsets.pad1, offset + offsets.pad1 + 1);

                        if ('dl_type' in match.body) {
                            var dl_type = match.body.dl_type;
                        } else {
                            var dl_type = 0;
                            wildcards |= ofp.ofp_flow_wildcards.OFPFW_DL_TYPE;
                        }
                        buffer.writeUInt16BE(dl_type, offset + offsets.dl_type, true);

                        // TODO validate
                        if ('nw_tos' in match.body) {
                            var nw_tos = match.body.nw_tos;
                        } else {
                            var nw_tos = 0;
                            wildcards |= ofp.ofp_flow_wildcards.OFPFW_NW_TOS;
                        }
                        buffer.writeUInt8(nw_tos, offset + offsets.nw_tos, true);

                        if ('nw_proto' in match.body) {
                            var nw_proto = match.body.nw_proto;
                        } else {
                            var nw_proto = 0;
                            wildcards |= ofp.ofp_flow_wildcards.OFPFW_NW_PROTO;
                        }
                        buffer.writeUInt8(nw_proto, offset + offsets.nw_proto, true);

                        if ('nw_src' in match.body) {
                            if ('nw_src_mask' in match.body) {
                                packet.stringToIPv4(match.body.nw_src_mask, buffer, offset + offsets.nw_src_mask);
                            } else {
                                buffer.fill(0x00, offset + offsets.nw_src_mask, offset + offsets.nw_src_mask + 4); // TODO fill ?
                            }
                            packet.stringToIPv4(match.body.nw_src, buffer, offset + offsets.nw_src);
                        } else {
                            buffer.fill(0x00, offset + offsets.nw_src, offset + offsets.nw_src + 4); // TODO fill ?
                            buffer.fill(0xff, offset + offsets.nw_src_mask, offset + offsets.nw_src_mask + 4); // TODO fill ?
                        }

                        if ('nw_dst' in match.body) {
                            if ('nw_dst_mask' in match.body) {
                                packet.stringToIPv4(match.body.nw_dst_mask, buffer, offset + offsets.nw_dst_mask);
                            } else {
                                buffer.fill(0x00, offset + offsets.nw_dst_mask, offset + offsets.nw_dst_mask + 4); // TODO fill ?
                            }
                            packet.stringToIPv4(match.body.nw_dst, buffer, offset + offsets.nw_dst);
                        } else {
                            buffer.fill(0x00, offset + offsets.nw_dst, offset + offsets.nw_dst + 4); // TODO fill ?
                            buffer.fill(0xff, offset + offsets.nw_dst_mask, offset + offsets.nw_dst_mask + 4); // TODO fill ?
                        }

                        if ('tp_src' in match.body) {
                            var tp_src = match.body.tp_src;
                        } else {
                            var tp_src = 0;
                            wildcards |= ofp.ofp_flow_wildcards.OFPFW_TP_SRC;
                        }
                        buffer.writeUInt16BE(tp_src, offset + offsets.tp_src, true);

                        if ('tp_dst' in match.body) {
                            var tp_dst = match.body.tp_dst;
                        } else {
                            var tp_dst = 0;
                            wildcards |= ofp.ofp_flow_wildcards.OFPFW_TP_DST;
                        }
                        buffer.writeUInt16BE(tp_dst, offset + offsets.tp_dst, true);

                        // TODO validate
                        if ('mpls_label' in match.body) {
                            var mpls_label = match.body.mpls_label;
                        } else {
                            var mpls_label = 0;
                            wildcards |= ofp.ofp_flow_wildcards.OFPFW_MPLS_LABEL;
                        }
                        buffer.writeUInt32BE(mpls_label, offset + offsets.mpls_label, true);

                        // TODO validate
                        if ('mpls_tc' in match.body) {
                            var mpls_tc = match.body.mpls_tc;
                        } else {
                            var mpls_tc = 0;
                            wildcards |= ofp.ofp_flow_wildcards.OFPFW_MPLS_TC;
                        }
                        buffer.writeUInt8(mpls_tc, offset + offsets.mpls_tc, true);

                        buffer.fill(0, offset + offsets.pad2, offset + offsets.pad2 + 3);

                        if ('metadata' in match.body) {
                            if ('metadata_mask' in match.body) {
                                match.body.metadata_mask.copy(buffer, offset + offsets.metadata_mask);
                            } else {
                                buffer.fill(0x00, offset + offsets.metadata_mask, offset + offsets.metadata_mask + 8); // TODO fill ?
                            }
                            match.body.metadata.copy(buffer, offset + offsets.metadata);
                        } else {
                            buffer.fill(0x00, offset + offsets.metadata, offset + offsets.metadata + 8); // TODO fill ?
                            buffer.fill(0xff, offset + offsets.metadata_mask, offset + offsets.metadata_mask + 8); // TODO fill ?
                        }

                        buffer.writeUInt32BE(wildcards, offset + offsets.wildcards, true);

                        if (warnings.length == 0) {
                            return {
                                offset : offset + ofp.sizes.ofp_match
                            }
                        } else {
                            return {
                                warnings: warnings,
                                offset : offset + ofp.sizes.ofp_match
                            }
                        }

            }

}

})();
