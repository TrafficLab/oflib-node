/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

var util = require('util');
var ofp = require('./ofp.js');
var packet = require('./packet.js');

/*
 * Returns:
 * {"action" : <JSON>, "offset" : <offset after action> }
 * Error:
 * {"error" : "<error text>" [, "ofp_error" : {"type" : <type>, "code" : <code>}]}
 */
module.exports = function action_unpack(buffer, offset) {
        var action = {};

        if (buffer.length < offset + ofp.sizes.ofp_action_header) {
            return {
                "error" : util.format('Received action is too short (%d).', (buffer.length - offset)),
                "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'}
            }
        }

        var type = buffer.readUInt16BE(offset, true);
        var len  = buffer.readUInt16BE(offset+2, true);

        if (buffer.length < offset + len) {
            return {
                "error" : util.format('Received action has invalid length (set to %d, but only %d received).', len, (buffer.length - offset)),
                "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'}
            }
        }

        offset += 4;

        if ((len % 8) != 0) {
            return {
                "error" : util.format('Received action length is not a multiple of 64 bits (%d).', len),
                "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'}
            }
        }

        switch (type) {
            case ofp.ofp_action_type.OFPAT_OUTPUT: {
                action.header = {"type" : 'OFPAT_OUTPUT'};
                action.body = {};

                if (len != ofp.sizes.ofp_action_output) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.header.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'}
                    }
                }

                action.body.port = buffer.readUInt32BE(offset, true);
                offset += 4;

                if (action.body.port == 0 ||
                    (action.body.port > ofp.ofp_port_no.OFPP_MAX && action.body.port < ofp.ofp_port_no.OFPP_IN_PORT) ||
                    action.body.port == ofp.ofp_port_no.OFPP_ANY) {
                        return {
                            "error" : util.format('Received %s action has invalid port (%d).', action.header.type, action.body.port),
                            "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_OUT_PORT'}
                        }
                }


                if (action.body.port == ofp.ofp_port_no.OFPP_CONTROLLER) {
                    action.body.max_len = buffer.readUInt16BE(offset, true);
                }
                offset += 8; /* + pad */

                /* convert special values */
                if (action.body.port in ofp.ofp_port_no_rev) {
                    action.body.port = ofp.ofp_port_no_rev[action.body.port];
                }

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_SET_VLAN_VID: {
                action.header = {"type" : 'OFPAT_SET_VLAN_VID'};
                action.body = {};

                if (len != ofp.sizes.ofp_action_vlan_vid) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.header.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'}
                    }
                }

                action.body.vlan_vid = buffer.readUInt16BE(offset, true);
                offset += 4; /* + pad */

                if (action.body.vlan_vid > packet.VLAN_VID_MAX) {
                    return {
                        "error" : util.format('Received %s action has invalid vid (%d).', action.header.type, action.body.vlan_vid),
                        "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_ARGUMENT'}
                    }
                }

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_SET_VLAN_PCP: {
                action.header = {"type" : 'OFPAT_SET_VLAN_PCP'};
                action.body = {};

                if (len != ofp.sizes.ofp_action_vlan_pcp) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.header.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'}
                    }
                }

                action.body.vlan_pcp = buffer.readUInt8(offset, true);
                offset += 4; /* + pad */

                if (action.body.vlan_pcp > packet.VLAN_PCP_MAX) {
                    return {
                        "error" : util.format('Received %s action has invalid pcp (%d).', action.header.type, action.body.vlan_pcp),
                        "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_ARGUMENT'}
                    }
                }

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_SET_DL_SRC: {
                action.header = {"type" : 'OFPAT_SET_DL_SRC'};
                action.body = {};

                if (len != ofp.sizes.ofp_action_dl_addr) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.header.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'}
                    }
                }

                action.body.dl_addr = packet.ethToString(buffer, offset);
                offset += 12; /* + pad */

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_SET_DL_DST: {
                action.header = {"type" : 'OFPAT_SET_DL_DST'};
                action.body = {};

                if (len != ofp.sizes.ofp_action_dl_addr) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.header.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'}
                    }
                }

                action.body.dl_addr = packet.ethToString(buffer, offset);
                offset += 12; /* + pad */

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_SET_NW_SRC: {
                action.header = {"type" : 'OFPAT_SET_NW_SRC'};
                action.body = {};

                if (len != ofp.sizes.ofp_action_nw_addr) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.header.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'}
                    }
                }

                action.body.nw_addr = packet.ipv4ToString(buffer, offset);
                offset += 4;

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_SET_NW_DST: {
                action.header = {"type" : 'OFPAT_SET_NW_DST'};
                action.body = {};

                if (len != ofp.sizes.ofp_action_nw_addr) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.header.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'}
                    }
                }

                action.body.nw_addr = packet.ipv4ToString(buffer, offset);
                offset += 4;

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_SET_NW_TOS: {
                action.header = {"type" : 'OFPAT_SET_NW_TOS'};
                action.body = {};

                if (len != ofp.sizes.ofp_action_nw_tos) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.header.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'}
                    }
                }

                action.body.nw_tos = buffer.readUInt8(offset, true);
                offset += 4; /* + pad */

                if (action.body.nw_tos > packet.IP_DSCP_MAX) {
                    return {
                        "error" : util.format('Received %s action has invalid tos (%d).', action.header.type, action.body.nw_tos),
                        "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_ARGUMENT'}
                    }
                }

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_SET_NW_ECN: {
                action.header = {"type" : 'OFPAT_SET_NW_ECN'};
                action.body = {};

                if (len != ofp.sizes.ofp_action_nw_ecn) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.header.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'}
                    }
                }

                action.body.nw_ecn = buffer.readUInt8(offset, true);
                offset += 4; /* + pad */

                if (action.body.nw_tos > packet.IP_ECN_MAX) {
                    return {
                        "error" : util.format('Received %s action has invalid ecn (%d).', action.header.type, action.body.nw_ecn),
                        "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_ARGUMENT'}
                    }
                }

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_SET_TP_SRC: {
                action.header = {"type" : 'OFPAT_SET_TP_SRC'};
                action.body = {};

                if (len != ofp.sizes.ofp_action_tp_port) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.header.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'}
                    }
                }

                action.body.tp_port = buffer.readUInt16BE(offset, true);
                offset += 4; /* + pad */

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_SET_TP_DST: {
                action.header = {"type" : 'OFPAT_SET_TP_DST'};
                action.body = {};

                if (len != ofp.sizes.ofp_action_tp_port) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.header.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'}
                    }
                }

                action.body.tp_port = buffer.readUInt16BE(offset, true);
                offset += 4; /* + pad */

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_COPY_TTL_OUT: {
                action.header = {"type" : 'OFPAT_COPY_TTL_OUT'};

                if (len != ofp.sizes.ofp_action_header) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.header.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'}
                    }
                }

                offset += 4; /* + pad */

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_COPY_TTL_IN: {
                action.header = {"type" : 'OFPAT_COPY_TTL_IN'};

                if (len != ofp.sizes.ofp_action_header) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.header.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'}
                    }
                }

                offset += 4; /* + pad */

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_SET_MPLS_LABEL: {
                action.header = {"type" : 'OFPAT_SET_MPLS_LABEL'};
                action.body = {};

                if (len != ofp.sizes.ofp_action_mpls_label) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.header.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'}
                    }
                }

                action.body.mpls_label = buffer.readUInt32BE(offset, true);
                offset += 4;

                if (action.body.mpls_label > packet.MPLS_LABEL_MAX) {
                    return {
                        "error" : util.format('Received %s action has invalid label (%d).', action.header.type, action.body.mpls_label),
                        "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_ARGUMENT'}
                    }
                }

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_SET_MPLS_TC: {
                action.header = {"type" : 'OFPAT_SET_MPLS_TC'};
                action.body = {};

                if (len != ofp.sizes.ofp_action_mpls_tc) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.header.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'}
                    }
                }

                action.body.mpls_tc = buffer.readUInt8(offset, true);
                offset += 4; /* + pad */

                if (action.body.mpls_tc > packet.MPLS_TC_MAX) {
                    return {
                        "error" : util.format('Received %s action has invalid tc (%d).', action.header.type, action.body.mpls_tc),
                        "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_ARGUMENT'}
                    }
                }

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_SET_MPLS_TTL: {
                action.header = {"type" : 'OFPAT_SET_MPLS_TTL'};
                action.body = {};

                if (len != ofp.sizes.ofp_action_mpls_ttl) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.header.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'}
                    }
                }

                action.body.mpls_ttl = buffer.readUInt8(offset, true);
                offset += 4; /* + pad */

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_DEC_MPLS_TTL: {
                action.header = {"type" : 'OFPAT_DEC_MPLS_TTL'};

                if (len != ofp.sizes.ofp_action_header) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.header.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'}
                    }
                }

                offset += 4; /* + pad */

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_PUSH_VLAN: {
                action.header = {"type" : 'OFPAT_SET_PUSH_VLAN'};
                action.body = {};

                if (len != ofp.sizes.ofp_action_push) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.header.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'}
                    }
                }

                action.body.ethertype = buffer.readUInt16BE(offset, true);
                offset += 4; /* + pad */

                if (action.body.ethertype != packet.ETH_TYPE_VLAN &&
                    action.body.ethertype != packet.ETH_TYPE_VLAN_PBB) {
                        return {
                            "error" : util.format('Received %s action has invalid ethertype (%d).', action.header.type, action.body.ethertype),
                            "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_ARGUMENT'}
                        }
                }

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_PUSH_MPLS: {
                action.header = {"type" : 'OFPAT_SET_PUSH_MPLS'};
                action.body = {};

                if (len != ofp.sizes.ofp_action_push) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.header.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'}
                    }
                }

                action.body.ethertype = buffer.readUInt16BE(offset, true);
                offset += 4; /* + pad */

                if (action.body.ethertype != packet.ETH_TYPE_MPLS &&
                    action.body.ethertype != packet.ETH_TYPE_MPLS_MCAST) {
                        return {
                            "error" : util.format('Received %s action has invalid ethertype (%d).', action.header.type, action.body.ethertype),
                            "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_ARGUMENT'}
                        }
                }

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_POP_VLAN: {
                action.header = {"type" : 'OFPAT_POP_VLAN'};

                if (len != ofp.sizes.ofp_action_header) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.header.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'}
                    }
                }

                offset += 4; /* + pad */

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_POP_MPLS: {
                action.header = {"type" : 'OFPAT_POP_MPLS'};
                action.body = {};

                if (len != ofp.sizes.ofp_action_pop_mpls) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.header.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'}
                    }
                }

                action.body.ethertype = buffer.readUInt16BE(offset, true);
                offset += 4; /* + pad */

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_SET_QUEUE: {
                action.header = {"type" : 'OFPAT_SET_QUEUE'};
                action.body = {};

                if (len != ofp.sizes.ofp_action_set_queue) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.header.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'}
                    }
                }

                action.body.queue_id = buffer.readUInt32BE(offset, true);
                offset += 4;

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_GROUP: {
                action.header = {"type" : 'OFPAT_GROUP'};
                action.body = {};

                if (len != ofp.sizes.ofp_action_group) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.header.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'}
                    }
                }

                action.body.group_id = buffer.readUInt32BE(offset, true);
                offset += 4;

                if (action.body.group_id > ofp.ofp_group.OFPG_MAX) {
                    return {
                        "error" : util.format('Received %s action has invalid group_id (%d).', action.header.type, action.body.group_id),
                        "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_ARGUMENT'}
                        }
                }

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_SET_NW_TTL: {
                action.header = {"type" : 'OFPAT_SET_NW_TTL'};
                action.body = {};

                if (len != ofp.sizes.ofp_action_nw_ttl) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.header.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'}
                    }
                }

                action.body.group_id = buffer.readUInt8(offset, true);
                offset += 4; /* + pad */

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_DEC_NW_TTL: {
                action.header = {"type" : 'OFPAT_DEC_NW_TTL'};

                if (len != ofp.sizes.ofp_action_header) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.header.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'}
                    }
                }

                offset += 4; /* + pad */

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_EXPERIMENTER: {
                /* TODO: experimenter callback */
                action.header = {"type" : 'OFPAT_EXPERIMENTER'};
                action.body = {};

                if (len < ofp.sizes.ofp_action_experimenter_header) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.header.type, len),
                        "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'}
                    }
                }

                action.body.experimenter_id = buffer.readUInt32BE(offset, true);
                //offset += 4;
                offset += len - 4;

                return {"action" : action, "offset" : offset};
            }

            default: {
                return {
                    "error" : util.format('Received unknown action type (%d).', type),
                    "ofp_error" : {"type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_TYPE'}
                }
            }
        }
    }
