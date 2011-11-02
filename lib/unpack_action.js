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
 * {"error" : "<error text>" [, "ofp_error_type" : <ofp error type>, "ofp_error_code" : <ofp error code>]}
 */
module.exports = function action_unpack(buffer, offset) {
        var action = {};

        if (buffer.length < offset + ofp.sizes.ofp_action_header) {
            return {
                "error" : util.format('Received action is too short (%d).', (buffer.length - offset)),
                "ofp_error_type" : 'OFPET_BAD_ACTION',
                "ofp_error_code" : 'OFPBAC_BAD_LEN'
            }
        }

        var type = buffer.readUInt16BE(offset, true);
        var len  = buffer.readUInt16BE(offset+2, true);

        if (buffer.length < offset + len) {
            return {
                "error" : util.format('Received action has invalid length (set to %d, but only %d received).', len, (buffer.length - offset)),
                "ofp_error_type" : 'OFPET_BAD_ACTION',
                "ofp_error_code" : 'OFPBAC_BAD_LEN'
            }
        }

        offset += 4;

        if ((len % 8) != 0) {
            return {
                "error" : util.format('Received action length is not a multiple of 64 bits (%d).', len),
                "ofp_error_type" : 'OFPET_BAD_ACTION',
                "ofp_error_code" : 'OFPBAC_BAD_LEN'
            }
        }

        switch (type) {
            case ofp.ofp_action_type.OFPAT_OUTPUT: {
                action.type = 'OFPAT_OUTPUT';

                if (len != ofp.sizes.ofp_action_output) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.type, len),
                        "ofp_error_type" : 'OFPET_BAD_ACTION',
                        "ofp_error_code" : 'OFPBAC_BAD_LEN'
                    }
                }

                action.port = buffer.readUInt32BE(offset, true);
                offset += 4;

                if (action.port == 0 ||
                    (action.port > ofp.ofp_port_no.OFPP_MAX && action.port < ofp.ofp_port_no.OFPP_IN_PORT) ||
                    action.port == ofp.ofp_port_no.OFPP_ANY) {
                        return {
                            "error" : util.format('Received %s action has invalid port (%d).', action.type, action.port),
                            "ofp_error_type" : 'OFPET_BAD_ACTION',
                            "ofp_error_code" : 'OFPBAC_BAD_OUT_PORT'
                        }
                }


                if (action.port == ofp.ofp_port_no.OFPP_CONTROLLER) {
                    action.max_len = buffer.readUInt16BE(offset, true);
                }
                offset += 8; /* + pad */

                /* convert special values */
                if (action.port in ofp.ofp_port_no_rev) {
                    action.port = ofp.ofp_port_no_rev[action.port];
                }

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_SET_VLAN_VID: {
                action.type = 'OFPAT_SET_VLAN_VID';

                if (len != ofp.sizes.ofp_action_vlan_vid) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.type, len),
                        "ofp_error_type" : 'OFPET_BAD_ACTION',
                        "ofp_error_code" : 'OFPBAC_BAD_LEN'
                    }
                }

                action.vlan_vid = buffer.readUInt16BE(offset, true);
                offset += 4; /* + pad */

                if (action.vlan_vid > packet.VLAN_VID_MAX) {
                    return {
                        "error" : util.format('Received %s action has invalid vid (%d).', action.type, action.vlan_vid),
                        "ofp_error_type" : 'OFPET_BAD_ACTION',
                        "ofp_error_code" : 'OFPBAC_BAD_ARGUMENT'
                    }
                }

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_SET_VLAN_PCP: {
                action.type = 'OFPAT_SET_VLAN_PCP';

                if (len != ofp.sizes.ofp_action_vlan_pcp) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.type, len),
                        "ofp_error_type" : 'OFPET_BAD_ACTION',
                        "ofp_error_code" : 'OFPBAC_BAD_LEN'
                    }
                }

                action.vlan_pcp = buffer.readUInt8(offset, true);
                offset += 4; /* + pad */

                if (action.vlan_pcp > packet.VLAN_PCP_MAX) {
                    return {
                        "error" : util.format('Received %s action has invalid pcp (%d).', action.type, action.vlan_pcp),
                        "ofp_error_type" : 'OFPET_BAD_ACTION',
                        "ofp_error_code" : 'OFPBAC_BAD_ARGUMENT'
                    }
                }

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_SET_DL_SRC: {
                action.type = 'OFPAT_SET_DL_SRC';

                if (len != ofp.sizes.ofp_action_dl_addr) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.type, len),
                        "ofp_error_type" : 'OFPET_BAD_ACTION',
                        "ofp_error_code" : 'OFPBAC_BAD_LEN'
                    }
                }

                action.dl_addr = packet.ethToString(buffer, offset);
                offset += 12; /* + pad */

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_SET_DL_DST: {
                action.type = 'OFPAT_SET_DL_DST';

                if (len != ofp.sizes.ofp_action_dl_addr) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.type, len),
                        "ofp_error_type" : 'OFPET_BAD_ACTION',
                        "ofp_error_code" : 'OFPBAC_BAD_LEN'
                    }
                }

                action.dl_addr = packet.ethToString(buffer, offset);
                offset += 12; /* + pad */

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_SET_NW_SRC: {
                action.type = 'OFPAT_SET_NW_SRC';

                if (len != ofp.sizes.ofp_action_nw_addr) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.type, len),
                        "ofp_error_type" : 'OFPET_BAD_ACTION',
                        "ofp_error_code" : 'OFPBAC_BAD_LEN'
                    }
                }

                action.nw_addr = packet.ipv4ToString(buffer, offset);
                offset += 4;

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_SET_NW_DST: {
                action.type = 'OFPAT_SET_NW_DST';

                if (len != ofp.sizes.ofp_action_nw_addr) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.type, len),
                        "ofp_error_type" : 'OFPET_BAD_ACTION',
                        "ofp_error_code" : 'OFPBAC_BAD_LEN'
                    }
                }

                action.nw_addr = packet.ipv4ToString(buffer, offset);
                offset += 4;

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_SET_NW_TOS: {
                action.type = 'OFPAT_SET_NW_TOS';

                if (len != ofp.sizes.ofp_action_nw_tos) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.type, len),
                        "ofp_error_type" : 'OFPET_BAD_ACTION',
                        "ofp_error_code" : 'OFPBAC_BAD_LEN'
                    }
                }

                action.nw_tos = buffer.readUInt8(offset, true);
                offset += 4; /* + pad */

                if (action.nw_tos > packet.IP_DSCP_MAX) {
                    return {
                        "error" : util.format('Received %s action has invalid tos (%d).', action.type, action.nw_tos),
                        "ofp_error_type" : 'OFPET_BAD_ACTION',
                        "ofp_error_code" : 'OFPBAC_BAD_ARGUMENT'
                    }
                }

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_SET_NW_ECN: {
                action.type = 'OFPAT_SET_NW_ECN';

                if (len != ofp.sizes.ofp_action_nw_ecn) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.type, len),
                        "ofp_error_type" : 'OFPET_BAD_ACTION',
                        "ofp_error_code" : 'OFPBAC_BAD_LEN'
                    }
                }

                action.nw_ecn = buffer.readUInt8(offset, true);
                offset += 4; /* + pad */

                if (action.nw_tos > packet.IP_ECN_MAX) {
                    return {
                        "error" : util.format('Received %s action has invalid ecn (%d).', action.type, action.nw_ecn),
                        "ofp_error_type" : 'OFPET_BAD_ACTION',
                        "ofp_error_code" : 'OFPBAC_BAD_ARGUMENT'
                    }
                }

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_SET_TP_SRC: {
                action.type = 'OFPAT_SET_TP_SRC';

                if (len != ofp.sizes.ofp_action_tp_port) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.type, len),
                        "ofp_error_type" : 'OFPET_BAD_ACTION',
                        "ofp_error_code" : 'OFPBAC_BAD_LEN'
                    }
                }

                action.tp_port = buffer.readUInt16BE(offset, true);
                offset += 4; /* + pad */

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_SET_TP_DST: {
                action.type = 'OFPAT_SET_TP_DST';

                if (len != ofp.sizes.ofp_action_tp_port) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.type, len),
                        "ofp_error_type" : 'OFPET_BAD_ACTION',
                        "ofp_error_code" : 'OFPBAC_BAD_LEN'
                    }
                }

                action.tp_port = buffer.readUInt16BE(offset, true);
                offset += 4; /* + pad */

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_COPY_TTL_OUT: {
                action.type = 'OFPAT_COPY_TTL_OUT';

                if (len != ofp.sizes.ofp_action_header) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.type, len),
                        "ofp_error_type" : 'OFPET_BAD_ACTION',
                        "ofp_error_code" : 'OFPBAC_BAD_LEN'
                    }
                }

                offset += 4; /* + pad */

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_COPY_TTL_IN: {
                action.type = 'OFPAT_COPY_TTL_IN';

                if (len != ofp.sizes.ofp_action_header) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.type, len),
                        "ofp_error_type" : 'OFPET_BAD_ACTION',
                        "ofp_error_code" : 'OFPBAC_BAD_LEN'
                    }
                }

                offset += 4; /* + pad */

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_SET_MPLS_LABEL: {
                action.type = 'OFPAT_SET_MPLS_LABEL';

                if (len != ofp.sizes.ofp_action_mpls_label) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.type, len),
                        "ofp_error_type" : 'OFPET_BAD_ACTION',
                        "ofp_error_code" : 'OFPBAC_BAD_LEN'
                    }
                }

                action.mpls_label = buffer.readUInt32BE(offset, true);
                offset += 4;

                if (action.mpls_label > packet.MPLS_LABEL_MAX) {
                    return {
                        "error" : util.format('Received %s action has invalid label (%d).', action.type, action.mpls_label),
                        "ofp_error_type" : 'OFPET_BAD_ACTION',
                        "ofp_error_code" : 'OFPBAC_BAD_ARGUMENT'
                    }
                }

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_SET_MPLS_TC: {
                action.type = 'OFPAT_SET_MPLS_TC';

                if (len != ofp.sizes.ofp_action_mpls_tc) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.type, len),
                        "ofp_error_type" : 'OFPET_BAD_ACTION',
                        "ofp_error_code" : 'OFPBAC_BAD_LEN'
                    }
                }

                action.mpls_tc = buffer.readUInt8(offset, true);
                offset += 4; /* + pad */

                if (action.mpls_tc > packet.MPLS_TC_MAX) {
                    return {
                        "error" : util.format('Received %s action has invalid tc (%d).', action.type, action.mpls_tc),
                        "ofp_error_type" : 'OFPET_BAD_ACTION',
                        "ofp_error_code" : 'OFPBAC_BAD_ARGUMENT'
                    }
                }

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_SET_MPLS_TTL: {
                action.type = 'OFPAT_SET_MPLS_TTL';

                if (len != ofp.sizes.ofp_action_mpls_ttl) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.type, len),
                        "ofp_error_type" : 'OFPET_BAD_ACTION',
                        "ofp_error_code" : 'OFPBAC_BAD_LEN'
                    }
                }

                action.mpls_ttl = buffer.readUInt8(offset, true);
                offset += 4; /* + pad */

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_DEC_MPLS_TTL: {
                action.type = 'OFPAT_DEC_MPLS_TTL';

                if (len != ofp.sizes.ofp_action_header) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.type, len),
                        "ofp_error_type" : 'OFPET_BAD_ACTION',
                        "ofp_error_code" : 'OFPBAC_BAD_LEN'
                    }
                }

                offset += 4; /* + pad */

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_PUSH_VLAN: {
                action.type = 'OFPAT_SET_PUSH_VLAN';

                if (len != ofp.sizes.ofp_action_push) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.type, len),
                        "ofp_error_type" : 'OFPET_BAD_ACTION',
                        "ofp_error_code" : 'OFPBAC_BAD_LEN'
                    }
                }

                action.ethertype = buffer.readUInt16BE(offset, true);
                offset += 4; /* + pad */

                if (action.ethertype != packet.ETH_TYPE_VLAN &&
                    action.ethertype != packet.ETH_TYPE_VLAN_PBB) {
                        return {
                            "error" : util.format('Received %s action has invalid ethertype (%d).', action.type, action.ethertype),
                            "ofp_error_type" : 'OFPET_BAD_ACTION',
                            "ofp_error_code" : 'OFPBAC_BAD_ARGUMENT'
                        }
                }

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_PUSH_MPLS: {
                action.type = 'OFPAT_SET_PUSH_MPLS';

                if (len != ofp.sizes.ofp_action_push) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.type, len),
                        "ofp_error_type" : 'OFPET_BAD_ACTION',
                        "ofp_error_code" : 'OFPBAC_BAD_LEN'
                    }
                }

                action.ethertype = buffer.readUInt16BE(offset, true);
                offset += 4; /* + pad */

                if (action.ethertype != packet.ETH_TYPE_MPLS &&
                    action.ethertype != packet.ETH_TYPE_MPLS_MCAST) {
                        return {
                            "error" : util.format('Received %s action has invalid ethertype (%d).', action.type, action.ethertype),
                            "ofp_error_type" : 'OFPET_BAD_ACTION',
                            "ofp_error_code" : 'OFPBAC_BAD_ARGUMENT'
                        }
                }

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_POP_VLAN: {
                action.type = 'OFPAT_POP_VLAN';

                if (len != ofp.sizes.ofp_action_header) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.type, len),
                        "ofp_error_type" : 'OFPET_BAD_ACTION',
                        "ofp_error_code" : 'OFPBAC_BAD_LEN'
                    }
                }

                offset += 4; /* + pad */

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_POP_MPLS: {
                action.type = 'OFPAT_SET_POP_MPLS';

                if (len != ofp.sizes.ofp_action_pop_mpls) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.type, len),
                        "ofp_error_type" : 'OFPET_BAD_ACTION',
                        "ofp_error_code" : 'OFPBAC_BAD_LEN'
                    }
                }

                action.ethertype = buffer.readUInt16BE(offset, true);
                offset += 4; /* + pad */

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_SET_QUEUE: {
                action.type = 'OFPAT_SET_QUEUE';

                if (len != ofp.sizes.ofp_action_set_queue) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.type, len),
                        "ofp_error_type" : 'OFPET_BAD_ACTION',
                        "ofp_error_code" : 'OFPBAC_BAD_LEN'
                    }
                }

                action.queue_id = buffer.readUInt32BE(offset, true);
                offset += 4;

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_GROUP: {
                action.type = 'OFPAT_GROUP';

                if (len != ofp.sizes.ofp_action_group) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.type, len),
                        "ofp_error_type" : 'OFPET_BAD_ACTION',
                        "ofp_error_code" : 'OFPBAC_BAD_LEN'
                    }
                }

                action.group_id = buffer.readUInt32BE(offset, true);
                offset += 4;

                if (action.group_id > ofp.ofp_group.OFPG_MAX) {
                    return {
                        "error" : util.format('Received %s action has invalid group_id (%d).', action.type, action.group_id),
                        "ofp_error_type" : 'OFPET_BAD_ACTION',
                        "ofp_error_code" : 'OFPBAC_BAD_ARGUMENT'
                        }
                }

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_SET_NW_TTL: {
                action.type = 'OFPAT_SET_NW_TTL';

                if (len != ofp.sizes.ofp_action_nw_ttl) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.type, len),
                        "ofp_error_type" : 'OFPET_BAD_ACTION',
                        "ofp_error_code" : 'OFPBAC_BAD_LEN'
                    }
                }

                action.group_id = buffer.readUInt8(offset, true);
                offset += 4; /* + pad */

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_DEC_NW_TTL: {
                action.type = 'OFPAT_DEC_NW_TTL';

                if (len != ofp.sizes.ofp_action_header) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.type, len),
                        "ofp_error_type" : 'OFPET_BAD_ACTION',
                        "ofp_error_code" : 'OFPBAC_BAD_LEN'
                    }
                }

                offset += 4; /* + pad */

                return {"action" : action, "offset" : offset};
            }

            case ofp.ofp_action_type.OFPAT_EXPERIMENTER: {
                /* TODO: experimenter callback */
                action.type = 'OFPAT_EXPERIMENTER';

                if (len < ofp.sizes.ofp_action_experimenter_header) {
                    return {
                        "error" : util.format('Received %s action has invalid length (%d).', action.type, len),
                        "ofp_error_type" : 'OFPET_BAD_ACTION',
                        "ofp_error_code" : 'OFPBAC_BAD_LEN'
                    }
                }

                action.experimenter_id = buffer.readUInt32BE(offset, true);
                //offset += 4;
                offset += len - 4;

                return {"action" : action, "offset" : offset};
            }

            default: {
                return {
                    "error" : util.format('Received unknown action type (%d).', type),
                    "ofp_error_type" : 'OFPET_BAD_ACTION',
                    "ofp_error_code" : 'OFPBAC_BAD_TYPE'
                }
            }
        }
    }
