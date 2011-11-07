/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports = {
        "OFP_VERSION" : 0x02,

        "OFP_MAX_TABLE_NAME_LEN" : 32,
        "OFP_MAX_PORT_NAME_LEN" : 16,

        "OFP_TCP_PORT" : 6633,
        "OFP_SSL_PORT" : 6633,

        "OFP_ETH_ALEN" : 6,          /* Bytes in an Ethernet address. */

        /* Port numbering. Ports are numbered starting from 1. */
        "ofp_port_no" : {
            /* Maximum number of physical switch ports. */
            "OFPP_MAX"        : 0xffffff00,

            /* Fake output "ports". */
            "OFPP_IN_PORT"    : 0xfffffff8,  /* Send the packet out the input port.  This
                                                virtual port must be explicitly used
                                                in order to send back out of the input
                                                port. */
            "OFPP_TABLE"      : 0xfffffff9,  /* Submit the packet to the first flow tableo/
                                                NB: This destination port can only be
                                                used in packet-out messages. */
            "OFPP_NORMAL"     : 0xfffffffa,  /* Process with normal L2/L3 switching. */
            "OFPP_FLOOD"      : 0xfffffffb,  /* All physical ports in VLAN, except input
                                                port and those blocked or link down. */
            "OFPP_ALL"        : 0xfffffffc,  /* All physical ports except input port. */
            "OFPP_CONTROLLER" : 0xfffffffd,  /* Send to controller. */
            "OFPP_LOCAL"      : 0xfffffffe,  /* Local openflow "port". */
            "OFPP_ANY"        : 0xffffffff   /* Wildcard port used only for flow mod
                                                (delete) and flow stats requests. Selects
                                                all flows regardless of output port
                                                (including flows with no output port). */
        },

        "ofp_type" : {
            /* Immutable messages. */
            "OFPT_HELLO"                     :  0,  /* Symmetric message */
            "OFPT_ERROR"                     :  1,  /* Symmetric message */
            "OFPT_ECHO_REQUEST"              :  2,  /* Symmetric message */
            "OFPT_ECHO_REPLY"                :  3,  /* Symmetric message */
            "OFPT_EXPERIMENTER"              :  4,  /* Symmetric message */

            /* Switch configuration messages. */
            "OFPT_FEATURES_REQUEST"          :  5,  /* Controller/switch message */
            "OFPT_FEATURES_REPLY"            :  6,  /* Controller/switch message */
            "OFPT_GET_CONFIG_REQUEST"        :  7,  /* Controller/switch message */
            "OFPT_GET_CONFIG_REPLY"          :  8,  /* Controller/switch message */
            "OFPT_SET_CONFIG"                :  9,  /* Controller/switch message */

            /* Asynchronous messages. */
            "OFPT_PACKET_IN"                 : 10,  /* Async message */
            "OFPT_FLOW_REMOVED"              : 11,  /* Async message */
            "OFPT_PORT_STATUS"               : 12,  /* Async message */

            /* Controller command messages. */
            "OFPT_PACKET_OUT"                : 13,  /* Controller/switch message */
            "OFPT_FLOW_MOD"                  : 14,  /* Controller/switch message */
            "OFPT_GROUP_MOD"                 : 15,  /* Controller/switch message */
            "OFPT_PORT_MOD"                  : 16,  /* Controller/switch message */
            "OFPT_TABLE_MOD"                 : 17,  /* Controller/switch message */

            /* Statistics messages. */
            "OFPT_STATS_REQUEST"             : 18,  /* Controller/switch message */
            "OFPT_STATS_REPLY"               : 19,  /* Controller/switch message */

            /* Barrier messages. */
            "OFPT_BARRIER_REQUEST"           : 20,  /* Controller/switch message */
            "OFPT_BARRIER_REPLY"             : 21,  /* Controller/switch message */

            /* Queue Configuration messages. */
            "OFPT_QUEUE_GET_CONFIG_REQUEST"  : 22,  /* Controller/switch message */
            "OFPT_QUEUE_GET_CONFIG_REPLY"    : 23     /* Controller/switch message */
        },


        "OFP_DEFAULT_MISS_SEND_LEN" : 128,

        "ofp_config_flags" : {
            /* Handling of IP fragments. */
            "OFPC_FRAG_NORMAL"   : 0,       /* No special handling for fragments. */
            "OFPC_FRAG_DROP"     : 1 << 0,  /* Drop fragments. */
            "OFPC_FRAG_REASM"    : 1 << 1,  /* Reassemble (only if OFPC_IP_REASM set). */
            "OFPC_FRAG_MASK"     : 3,

            /* TTL processing - applicable for IP and MPLS packets */
            "OFPC_INVALID_TTL_TO_CONTROLLER" : 1 << 2, /* Send packets with invalid TTL
                                                          ie. 0 or 1 to controller */
        },

        /* Flags to indicate behavior of the flow table for unmatched packets.
           These flags are used in ofp_table_stats messages to describe the current
           configuration and in ofp_table_mod messages to configure table behavior. */
        "ofp_table_config" : {
            "OFPTC_TABLE_MISS_CONTROLLER" : 0,        /* Send to controller. */
            "OFPTC_TABLE_MISS_CONTINUE"   : 1 << 0,   /* Continue to the next table in the
                                                         pipeline (OpenFlow 1.0
                                                         behavior). */
            "OFPTC_TABLE_MISS_DROP"       : 1 << 1    /* Drop the packet. */
        },


        /* Capabilities supported by the datapath. */
        "ofp_capabilities" : {
            "OFPC_FLOW_STATS"     : 1 << 0,   /* Flow statistics. */
            "OFPC_TABLE_STATS"    : 1 << 1,   /* Table statistics. */
            "OFPC_PORT_STATS"     : 1 << 2,   /* Port statistics. */
            "OFPC_GROUP_STATS"    : 1 << 3,   /* Group statistics. */
            "OFPC_IP_REASM"       : 1 << 5,   /* Can reassemble IP fragments. */
            "OFPC_QUEUE_STATS"    : 1 << 6,   /* Queue statistics. */
            "OFPC_ARP_MATCH_IP"   : 1 << 7    /* Match IP addresses in ARP pkts. */
        },

        /* Flags to indicate behavior of the physical port.  These flags are
         * used in ofp_port to describe the current configuration.  They are
         * used in the ofp_port_mod message to configure the port's behavior.
         */
        "ofp_port_config" : {
            "OFPPC_PORT_DOWN"    : 1 << 0,   /* Port is administratively down. */

            "OFPPC_NO_RECV"      : 1 << 2,   /* Drop all packets received by port. */
            "OFPPC_NO_FWD"       : 1 << 5,   /* Drop packets forwarded to port. */
            "OFPPC_NO_PACKET_IN" : 1 << 6    /* Do not send packet-in msgs for port. */
        },

        /* Current state of the physical port.  These are not configurable from
         * the controller.
         */
        "ofp_port_state" : {
            "OFPPS_LINK_DOWN"    : 1 << 0,   /* No physical link present. */
            "OFPPS_BLOCKED"      : 1 << 1,   /* Port is blocked */
            "OFPPS_LIVE"         : 1 << 2    /* Live for Fast Failover Group. */
        },

        /* Features of ports available in a datapath. */
        "ofp_port_features" : {
            "OFPPF_10MB_HD"    : 1 <<  0,   /* 10 Mb half-duplex rate support. */
            "OFPPF_10MB_FD"    : 1 <<  1,   /* 10 Mb full-duplex rate support. */
            "OFPPF_100MB_HD"   : 1 <<  2,   /* 100 Mb half-duplex rate support. */
            "OFPPF_100MB_FD"   : 1 <<  3,   /* 100 Mb full-duplex rate support. */
            "OFPPF_1GB_HD"     : 1 <<  4,   /* 1 Gb half-duplex rate support. */
            "OFPPF_1GB_FD"     : 1 <<  5,   /* 1 Gb full-duplex rate support. */
            "OFPPF_10GB_FD"    : 1 <<  6,   /* 10 Gb full-duplex rate support. */
            "OFPPF_40GB_FD"    : 1 <<  7,   /* 40 Gb full-duplex rate support. */
            "OFPPF_100GB_FD"   : 1 <<  8,   /* 100 Gb full-duplex rate support. */
            "OFPPF_1TB_FD"     : 1 <<  9,   /* 1 Tb full-duplex rate support. */
            "OFPPF_OTHER"      : 1 << 10,   /* Other rate, not in the list. */

            "OFPPF_COPPER"     : 1 << 11,   /* Copper medium. */
            "OFPPF_FIBER"      : 1 << 12,   /* Fiber medium. */
            "OFPPF_AUTONEG"    : 1 << 13,   /* Auto-negotiation. */
            "OFPPF_PAUSE"      : 1 << 14,   /* Pause. */
            "OFPPF_PAUSE_ASYM" : 1 << 15    /* Asymmetric pause. */
        },


        /* What changed about the physical port */
        "ofp_port_reason" : {
            "OFPPR_ADD"         : 0,   /* The port was added. */
            "OFPPR_DELETE"      : 1,   /* The port was removed. */
            "OFPPR_MODIFY"      : 2    /* Some attribute of the port has changed. */
        },


        /* Why is this packet being sent to the controller? */
        "ofp_packet_in_reason" : {
            "OFPR_NO_MATCH"      : 0,  /* No matching flow. */
            "OFPR_ACTION"        : 1   /* Action explicitly output to controller. */
        },


        "ofp_action_type" : {
            "OFPAT_OUTPUT"         :  0,       /* Output to switch port. */
            "OFPAT_SET_VLAN_VID"   :  1,       /* Set the 802.1q VLAN id. */
            "OFPAT_SET_VLAN_PCP"   :  2,       /* Set the 802.1q priority. */
            "OFPAT_SET_DL_SRC"     :  3,       /* Ethernet source address. */
            "OFPAT_SET_DL_DST"     :  4,       /* Ethernet destination address. */
            "OFPAT_SET_NW_SRC"     :  5,       /* IP source address. */
            "OFPAT_SET_NW_DST"     :  6,       /* IP destination address. */
            "OFPAT_SET_NW_TOS"     :  7,       /* IP ToS (DSCP field, 6 bits). */
            "OFPAT_SET_NW_ECN"     :  8,       /* IP ECN (2 bits). */
            "OFPAT_SET_TP_SRC"     :  9,       /* TCP/UDP/SCTP source port. */
            "OFPAT_SET_TP_DST"     : 10,       /* TCP/UDP/SCTP destination port. */
            "OFPAT_COPY_TTL_OUT"   : 11,       /* Copy TTL "outwards" -- from next-to-outermost to
                                                  outermost */
            "OFPAT_COPY_TTL_IN"    : 12,       /* Copy TTL "inwards" -- from outermost to
                                                  next-to-outermost */
            "OFPAT_SET_MPLS_LABEL" : 13,       /* MPLS label */
            "OFPAT_SET_MPLS_TC"    : 14,       /* MPLS TC */
            "OFPAT_SET_MPLS_TTL"   : 15,       /* MPLS TTL */
            "OFPAT_DEC_MPLS_TTL"   : 16,       /* Decrement MPLS TTL */

            "OFPAT_PUSH_VLAN"      : 17,       /* Push a new VLAN tag */
            "OFPAT_POP_VLAN"       : 18,       /* Pop the outer VLAN tag */
            "OFPAT_PUSH_MPLS"      : 19,       /* Push a new MPLS tag */
            "OFPAT_POP_MPLS"       : 20,       /* Pop the outer MPLS tag */
            "OFPAT_SET_QUEUE"      : 21,       /* Set queue id when outputting to a port */
            "OFPAT_GROUP"          : 22,       /* Apply group. */
            "OFPAT_SET_NW_TTL"     : 23,       /* IP TTL. */
            "OFPAT_DEC_NW_TTL"     : 24,       /* Decrement IP TTL. */
            "OFPAT_EXPERIMENTER"   : 0xffff
        },

        "ofp_flow_mod_command" : {
            "OFPFC_ADD"            : 0,    /* New flow. */
            "OFPFC_MODIFY"         : 1,    /* Modify all matching flows. */
            "OFPFC_MODIFY_STRICT"  : 2,    /* Modify entry strictly matching wildcards and
                                              priority. */
            "OFPFC_DELETE"         : 3,    /* Delete all matching flows. */
            "OFPFC_DELETE_STRICT"  : 4     /* Delete entry strictly matching wildcards and
                                              priority. */
        },

        /* Group commands */
        "ofp_group_mod_command" : {
            "OFPGC_ADD"        : 0,  /* New group. */
            "OFPGC_MODIFY"     : 1,  /* Modify all matching groups. */
            "OFPGC_DELETE"     : 2   /* Delete all matching groups. */
        },

        /* Flow wildcards. */
        "ofp_flow_wildcards" : {
            "OFPFW_IN_PORT"     : 1 << 0,   /* Switch input port. */
            "OFPFW_DL_VLAN"     : 1 << 1,   /* VLAN id. */
            "OFPFW_DL_VLAN_PCP" : 1 << 2,   /* VLAN priority. */
            "OFPFW_DL_TYPE"     : 1 << 3,   /* Ethernet frame type. */
            "OFPFW_NW_TOS"      : 1 << 4,   /* IP ToS (DSCP field, 6 bits). */
            "OFPFW_NW_PROTO"    : 1 << 5,   /* IP protocol. */
            "OFPFW_TP_SRC"      : 1 << 6,   /* TCP/UDP/SCTP source port. */
            "OFPFW_TP_DST"      : 1 << 7,   /* TCP/UDP/SCTP destination port. */
            "OFPFW_MPLS_LABEL"  : 1 << 8,   /* MPLS label. */
            "OFPFW_MPLS_TC"     : 1 << 9   /* MPLS TC. */
        },

        /* Values below this cutoff are 802.3 packets and the two bytes
         * following MAC addresses are used as a frame length.  Otherwise, the
         * two bytes are used as the Ethernet type.
         */
        "OFP_DL_TYPE_ETH2_CUTOFF" : 0x0600,

        /* Value of dl_type to indicate that the frame does not include an
         * Ethernet type.
         */
        "OFP_DL_TYPE_NOT_ETH_TYPE" : 0x05ff,

        /* The VLAN id is 12-bits, so we can use the entire 16 bits to indicate
         * special conditions.
         */
        "ofp_vlan_id" : {
            "OFPVID_ANY"  : 0xfffe, /* Indicate that a VLAN id is set but don't care
                                       about it's value. Note: only valid when specifying
                                       the VLAN id in a match */
            "OFPVID_NONE" : 0xffff  /* No VLAN id was set. */
        },

        /* The match type indicates the match structure (set of fields that compose the
         * match) in use. The match type is placed in the type field at the beginning
         * of all match structures. The "standard" type corresponds to ofp_match and
         * must be supported by all OpenFlow switches. Extensions that define other
         * match types may be published on the OpenFlow wiki. Support for extensions is
         * optional.
         */
        "ofp_match_type" : {
            "OFPMT_STANDARD"   : 0    /* The match fields defined in the ofp_match
                                         structure apply */
        },

        /* Value used in "idle_timeout" and "hard_timeout" to indicate that the entry
         * is permanent. */
        "OFP_FLOW_PERMANENT" : 0,

        /* By default, choose a priority in the middle. */
        "OFP_DEFAULT_PRIORITY" : 0x8000,

        "ofp_instruction_type" : {
            "OFPIT_GOTO_TABLE"     : 1,      /* Setup the next table in the lookup
                                                pipeline */
            "OFPIT_WRITE_METADATA" : 2,      /* Setup the metadata field for use later in
                                                pipeline */
            "OFPIT_WRITE_ACTIONS"  : 3,      /* Write the action(s) onto the datapath action
                                                set */
            "OFPIT_APPLY_ACTIONS"  : 4,      /* Applies the action(s) immediately */
            "OFPIT_CLEAR_ACTIONS"  : 5,      /* Clears all actions from the datapath
                                                action set */

            "OFPIT_EXPERIMENTER"   : 0xFFFF  /* Experimenter instruction */
        },

        "ofp_flow_mod_flags" : {
            "OFPFF_SEND_FLOW_REM" : 1 << 0,  /* Send flow removed message when flow
                                                expires or is deleted. */
            "OFPFF_CHECK_OVERLAP" : 1 << 1   /* Check for overlapping entries first. */
        },

        /* Group numbering. Groups can use any number up to OFPG_MAX. */
        "ofp_group" : {
            /* Last usable group number. */
            "OFPG_MAX"        : 0xffffff00,

            /* Fake groups. */
            "OFPG_ALL"        : 0xfffffffc,  /* Represents all groups for group delete
                                                commands. */
            "OFPG_ANY"        : 0xffffffff   /* Wildcard group used only for flow stats
                                                requests. Selects all flows regardless of
                                                group (including flows with no group).
                                                */
        },

        /* Group types.  Values in the range [128, 255] are reserved for experimental
         * use. */
        "ofp_group_type" : {
            "OFPGT_ALL"      : 0,  /* All (multicast/broadcast) group.  */
            "OFPGT_SELECT"   : 1,  /* Select group. */
            "OFPGT_INDIRECT" : 2,  /* Indirect group. */
            "OFPGT_FF"       : 3   /* Fast failover group. */
        },

        /* Why was this flow removed? */
        "ofp_flow_removed_reason" : {
            "OFPRR_IDLE_TIMEOUT"   : 0,   /* Flow idle time exceeded idle_timeout. */
            "OFPRR_HARD_TIMEOUT"   : 1,   /* Time exceeded hard_timeout. */
            "OFPRR_DELETE"         : 2,   /* Evicted by a DELETE flow mod. */
            "OFPRR_GROUP_DELETE"   : 3    /* Group was removed. */
        },


        /* Values for 'type' in ofp_error_message.  These values are immutable: they
         * will not change in future versions of the protocol (although new values may
         * be added). */
        "ofp_error_type" : {
            "OFPET_HELLO_FAILED"           :  0,   /* Hello protocol failed. */
            "OFPET_BAD_REQUEST"            :  1,   /* Request was not understood. */
            "OFPET_BAD_ACTION"             :  2,   /* Error in action description. */
            "OFPET_BAD_INSTRUCTION"        :  3,   /* Error in instruction list. */
            "OFPET_BAD_MATCH"              :  4,   /* Error in match. */
            "OFPET_FLOW_MOD_FAILED"        :  5,   /* Problem modifying flow entry. */
            "OFPET_GROUP_MOD_FAILED"       :  6,   /* Problem modifying group entry. */
            "OFPET_PORT_MOD_FAILED"        :  7,   /* Port mod request failed. */
            "OFPET_TABLE_MOD_FAILED"       :  8,   /* Table mod request failed. */
            "OFPET_QUEUE_OP_FAILED"        :  9,   /* Queue operation failed. */
            "OFPET_SWITCH_CONFIG_FAILED"   : 10    /* Switch config request failed. */
        },

        /* ofp_error_msg 'code' values for OFPET_HELLO_FAILED.  'data' contains an
         * ASCII text string that may give failure details. */
        "ofp_hello_failed_code" : {
            "OFPHFC_INCOMPATIBLE"     : 0,   /* No compatible version. */
            "OFPHFC_EPERM"            : 1    /* Permissions error. */
        },

        /* ofp_error_msg 'code' values for OFPET_BAD_REQUEST.  'data' contains at least
         * the first 64 bytes of the failed request. */
        "ofp_bad_request_code" : {
            "OFPBRC_BAD_VERSION"       : 1,    /* ofp_header.version not supported. */
            "OFPBRC_BAD_TYPE"          : 2,    /* ofp_header.type not supported. */
            "OFPBRC_BAD_STAT"          : 3,    /* ofp_stats_request.type not supported. */
            "OFPBRC_BAD_EXPERIMENTER"  : 3,    /* Experimenter id not supported
                                                  (in ofp_experimenter_header
                                                  or ofp_stats_request or ofp_stats_reply). */
            "OFPBRC_BAD_SUBTYPE"       : 4,    /* Experimenter subtype not supported. */
            "OFPBRC_EPERM"             : 5,    /* Permissions error. */
            "OFPBRC_BAD_LEN"           : 6,    /* Wrong request length for type. */
            "OFPBRC_BUFFER_EMPTY"      : 7,    /* Specified buffer has already been used. */
            "OFPBRC_BUFFER_UNKNOWN"    : 8,    /* Specified buffer does not exist. */
            "OFPBRC_BAD_TABLE_ID"      : 9     /* Specified table-id invalid or does not
                                                  exist. */
        },

        /* ofp_error_msg 'code' values for OFPET_BAD_ACTION.  'data' contains at least
         * the first 64 bytes of the failed request. */
        "ofp_bad_action_code" : {
            "OFPBAC_BAD_TYPE"               :  0,   /* Unknown action type. */
            "OFPBAC_BAD_LEN"                :  1,   /* Length problem in actions. */
            "OFPBAC_BAD_EXPERIMENTER"       :  2,   /* Unknown experimenter id specified. */
            "OFPBAC_BAD_EXPERIMENTER_TYPE"  :  3,   /* Unknown action type for experimenter id. */
            "OFPBAC_BAD_OUT_PORT"           :  4,   /* Problem validating output port. */
            "OFPBAC_BAD_ARGUMENT"           :  5,   /* Bad action argument. */
            "OFPBAC_EPERM"                  :  6,   /* Permissions error. */
            "OFPBAC_TOO_MANY"               :  7,   /* Can't handle this many actions. */
            "OFPBAC_BAD_QUEUE"              :  8,   /* Problem validating output queue. */
            "OFPBAC_BAD_OUT_GROUP"          :  9,   /* Invalid group id in forward action. */
            "OFPBAC_MATCH_INCONSISTENT"     : 10,   /* Action can't apply for this match. */
            "OFPBAC_UNSUPPORTED_ORDER"      : 11,   /* Action order is unsupported for the action
                                                       list in an Apply-Actions instruction */
            "OFPBAC_BAD_TAG"                : 12    /* Actions uses an unsupported
                                                       tag/encap. */
        },

        /* ofp_error_msg 'code' values for OFPET_BAD_INSTRUCTION.  'data' contains at least
         * the first 64 bytes of the failed request. */
        "ofp_bad_instruction_code" : {
            "OFPBIC_UNKNOWN_INST"          : 0,   /* Unknown instruction. */
            "OFPBIC_UNSUP_INST"            : 1,   /* Switch or table does not support the
                                                     instruction. */
            "OFPBIC_BAD_TABLE_ID"          : 2,   /* Invalid Table-ID specified. */
            "OFPBIC_UNSUP_METADATA"        : 3,   /* Metadata value unsupported by datapath. */
            "OFPBIC_UNSUP_METADATA_MASK"   : 4,   /* Metadata mask value unsupported by
                                                     datapath. */
            "OFPBIC_UNSUP_EXP_INST"        : 5    /* Specific experimenter instruction
                                                     unsupported. */
        },

        /* ofp_error_msg 'code' values for OFPET_BAD_MATCH.  'data' contains at least
         * the first 64 bytes of the failed request. */
        "ofp_bad_match_code" : {
            "OFPBMC_BAD_TYPE"           : 0,    /* Unsupported match type specified by the
                                                   match */
            "OFPBMC_BAD_LEN"            : 1,    /* Length problem in match. */
            "OFPBMC_BAD_TAG"            : 2,    /* Match uses an unsupported tag/encap. */
            "OFPBMC_BAD_DL_ADDR_MASK"   : 3,    /* Unsupported datalink addr mask - switch does
                                                   not support arbitrary datalink address
                                                   mask. */
            "OFPBMC_BAD_NW_ADDR_MASK"   : 4,    /* Unsupported network addr mask - switch does
                                                   not support arbitrary network address
                                                   mask. */
            "OFPBMC_BAD_WILDCARDS"      : 5,    /* Unsupported wildcard specified in the
                                                   match. */
            "OFPBMC_BAD_FIELD"          : 6,    /* Unsupported field in the match. */
            "OFPBMC_BAD_VALUE"          : 7     /* Unsupported value in a match field. */
        },

        /* ofp_error_msg 'code' values for OFPET_FLOW_MOD_FAILED.  'data' contains
         * at least the first 64 bytes of the failed request. */
        "ofp_flow_mod_failed_code" : {
            "OFPFMFC_UNKNOWN"        : 0,    /* Unspecified error. */
            "OFPFMFC_TABLE_FULL"     : 1,    /* Flow not added because table was full. */
            "OFPFMFC_BAD_TABLE_ID"   : 2,    /* Table does not exist */
            "OFPFMFC_OVERLAP"        : 3,    /* Attempted to add overlapping flow with
                                                CHECK_OVERLAP flag set. */
            "OFPFMFC_EPERM"          : 4,    /* Permissions error. */
            "OFPFMFC_BAD_TIMEOUT"    : 5,    /* Flow not added because of unsupported
                                                idle/hard timeout. */
            "OFPFMFC_BAD_COMMAND"    : 6     /* Unsupported or unknown command. */
        },

        /* ofp_error_msg 'code' values for OFPET_GROUP_MOD_FAILED.  'data' contains
         * at least the first 64 bytes of the failed request. */
        "ofp_group_mod_failed_code" : {
            "OFPGMFC_GROUP_EXISTS"           : 0,   /* Group not added because a group ADD
                                                       attempted to replace an
                                                       already-present group. */
            "OFPGMFC_INVALID_GROUP"          : 1,   /* Group not added because Group specified
                                                       is invalid. */
            "OFPGMFC_WEIGHT_UNSUPPORTED"     : 2,   /* Switch does not support unequal load
                                                       sharing with select groups. */
            "OFPGMFC_OUT_OF_GROUPS"          : 3,   /* The group table is full. */
            "OFPGMFC_OUT_OF_BUCKETS"         : 4,   /* The maximum number of action buckets
                                                       for a group has been exceeded. */
            "OFPGMFC_CHAINING_UNSUPPORTED"   : 5,   /* Switch does not support groups that
                                                       forward to groups. */
            "OFPGMFC_WATCH_UNSUPPORTED"      : 6,   /* This group cannot watch the
                                                       watch_port or watch_group specified. */
            "OFPGMFC_LOOP"                   : 7,   /* Group entry would cause a loop. */
            "OFPGMFC_UNKNOWN_GROUP"          : 8    /* Group not modified because a group
                                                       MODIFY attempted to modify a
                                                       non-existent group. */
        },

        /* ofp_error_msg 'code' values for OFPET_PORT_MOD_FAILED.  'data' contains
         * at least the first 64 bytes of the failed request. */
        "ofp_port_mod_failed_code" : {
            "OFPPMFC_BAD_PORT"        : 0,    /* Specified port number does not exist. */
            "OFPPMFC_BAD_HW_ADDR"     : 1,    /* Specified hardware address does not
                                                 match the port number. */
            "OFPPMFC_BAD_CONFIG"      : 2,    /* Specified config is invalid. */
            "OFPPMFC_BAD_ADVERTISE"   : 3     /* Specified advertise is invalid. */
        },

        /* ofp_error_msg 'code' values for OFPET_TABLE_MOD_FAILED.  'data' contains
         * at least the first 64 bytes of the failed request. */
        "ofp_table_mod_failed_code" : {
            "OFPTMFC_BAD_TABLE"     : 0,   /* Specified table does not exist. */
            "OFPTMFC_BAD_CONFIG"    : 1    /* Specified config is invalid. */
        },

        /* ofp_error msg 'code' values for OFPET_QUEUE_OP_FAILED. 'data' contains
         * at least the first 64 bytes of the failed request */
        "ofp_queue_op_failed_code" : {
            "OFPQOFC_BAD_PORT"    : 0,   /* Invalid port (or port does not exist). */
            "OFPQOFC_BAD_QUEUE"   : 1,   /* Queue does not exist. */
            "OFPQOFC_EPERM"       : 2    /* Permissions error. */
        },

        /* ofp_error_msg 'code' values for OFPET_SWITCH_CONFIG_FAILED. 'data' contains
         * at least the first 64 bytes of the failed request. */
        "ofp_switch_config_failed_code" : {
            "OFPSCFC_BAD_FLAGS"   : 0,   /* Specified flags is invalid. */
            "OFPSCFC_BAD_LEN"     : 1,   /* Specified len is invalid. */
        },


        "ofp_stats_types" : {
            /* Description of this OpenFlow switch.
             * The request body is empty.
             * The reply body is struct ofp_desc_stats. */
            "OFPST_DESC"           : 0,

            /* Individual flow statistics.
             * The request body is struct ofp_flow_stats_request.
             * The reply body is an array of struct ofp_flow_stats. */
            "OFPST_FLOW"           : 1,

            /* Aggregate flow statistics.
             * The request body is struct ofp_aggregate_stats_request.
             * The reply body is struct ofp_aggregate_stats_reply. */
            "OFPST_AGGREGATE"      : 2,

            /* Flow table statistics.
             * The request body is empty.
             * The reply body is an array of struct ofp_table_stats. */
            "OFPST_TABLE"          : 3,

            /* Port statistics.
             * The request body is struct ofp_port_stats_request.
             * The reply body is an array of struct ofp_port_stats. */
            "OFPST_PORT"           : 4,

            /* Queue statistics for a port
             * The request body defines the port
             * The reply body is an array of struct ofp_queue_stats */
            "OFPST_QUEUE"          : 5,

            /* Group counter statistics.
             * The request body is empty.
             * The reply is struct ofp_group_stats. */
            "OFPST_GROUP"          : 6,

            /* Group description statistics.
             * The request body is empty.
             * The reply body is struct ofp_group_desc_stats. */
            "OFPST_GROUP_DESC"     : 7,

            /* Experimenter extension.
             * The request and reply bodies begin with a 32-bit experimenter ID,
             * which takes the same form as in "struct ofp_experimenter_header".
             * The request and reply bodies are otherwise experimenter-defined. */
            "OFPST_EXPERIMENTER"   : 0xffff
        },

        "ofp_stats_reply_flags" : {
            "OFPSF_REPLY_MORE"   :  1 << 0   /* More replies to follow. */
        },


        "DESC_STR_LEN"   : 256,
        "SERIAL_NUM_LEN" : 32,

        /* Flow match fields. */
        "ofp_flow_match_fields" : {
            "OFPFMF_IN_PORT"     : 1 << 0,  /* Switch input port. */
            "OFPFMF_DL_VLAN"     : 1 << 1,  /* VLAN id. */
            "OFPFMF_DL_VLAN_PCP" : 1 << 2,  /* VLAN priority. */
            "OFPFMF_DL_TYPE"     : 1 << 3,  /* Ethernet frame type. */
            "OFPFMF_NW_TOS"      : 1 << 4,  /* IP ToS (DSCP field, 6 bits). */
            "OFPFMF_NW_PROTO"    : 1 << 5,  /* IP protocol. */
            "OFPFMF_TP_SRC"      : 1 << 6,  /* TCP/UDP/SCTP source port. */
            "OFPFMF_TP_DST"      : 1 << 7,  /* TCP/UDP/SCTP destination port. */
            "OFPFMF_MPLS_LABEL"  : 1 << 8,  /* MPLS label. */
            "OFPFMF_MPLS_TC"     : 1 << 9,  /* MPLS TC. */
            "OFPFMF_TYPE"        : 1 << 10, /* Match type. */
            "OFPFMF_DL_SRC"      : 1 << 11, /* Ethernet source address. */
            "OFPFMF_DL_DST"      : 1 << 12, /* Ethernet destination address. */
            "OFPFMF_NW_SRC"      : 1 << 13, /* IP source address. */
            "OFPFMF_NW_DST"      : 1 << 14, /* IP destination address. */
            "OFPFMF_METADATA"    : 1 << 15  /* Metadata passed between tables. */
        },

        /* All ones is used to indicate all queues in a port (for stats retrieval). */
        "OFPQ_ALL" : 0xffffffff,

        /* Min rate > 1000 means not configured. */
        "OFPQ_MIN_RATE_UNCFG" : 0xffff,

        "ofp_queue_properties" : {
            "OFPQT_NONE"       : 0,   /* No property defined for queue (default). */
            "OFPQT_MIN_RATE"   : 1,   /* Minimum datarate guaranteed. */
                                      /* Other types should be added here
                                       * (i.e. max rate, precedence, etc). */
        },


        "ofp_table" : {
            "OFPTT_MAX" : 254,
            "OFPTT_ALL" : 255
        },



        "sizes" : {
            "ofp_header" : 8,
            "ofp_switch_config" : 12,
            "ofp_table_mod" : 16,
            "ofp_port" : 64,
            "ofp_switch_features" : 32,
            "ofp_port_status" : 80,
            "ofp_port_mod" : 40,
            "ofp_packet_in" : 24,
            "ofp_action_output" : 16,
            "ofp_action_vlan_vid" : 8,
            "ofp_action_vlan_pcp" : 8,
            "ofp_action_dl_addr" : 16,
            "ofp_action_nw_addr" : 8,
            "ofp_action_tp_port" : 8,
            "ofp_action_nw_tos" : 8,
            "ofp_action_nw_ecn" : 8,
            "ofp_action_mpls_label" : 8,
            "ofp_action_mpls_tc" : 8,
            "ofp_action_mpls_ttl" : 8,
            "ofp_action_push" : 8,
            "ofp_action_pop_mpls" : 8,
            "ofp_action_group" : 8,
            "ofp_action_nw_ttl" : 8,
            "ofp_action_experimenter_header" : 8,
            "ofp_action_header" : 8,
            "ofp_packet_out" : 24,
            "ofp_match_header" : 4,
            "ofp_match_standard" : 88,
            "ofp_instruction" : 8,
            "ofp_instruction_goto_table" : 8,
            "ofp_instruction_write_metadata" : 24,
            "ofp_instruction_actions" : 8,
            "ofp_instruction_experimenter" : 8,
            "ofp_flow_mod" : 136,
            "ofp_bucket" : 16,
            "ofp_group_mod" : 16,
            "ofp_flow_removed" : 136,
            "ofp_error_msg" : 12,
            "ofp_stats_request" : 16,
            "ofp_stats_reply" : 16,
            "ofp_desc_stats" : 1056,
            "ofp_flow_stats_request" : 120,
            "ofp_flow_stats" : 136,
            "ofp_aggregate_stats_request" : 120,
            "ofp_aggregate_stats_reply" : 24,
            "ofp_table_stats" : 88,
            "ofp_port_stats_request" : 8,
            "ofp_port_stats" : 104,
            "ofp_group_stats_request" : 8,
            "ofp_bucket_counter" : 16,
            "ofp_group_stats" : 32,
            "ofp_group_desc_stats" : 8,
            "ofp_experimenter_header" : 8, /* originally 16 with padding */
            "ofp_queue_prop_header" : 8,
            "ofp_queue_prop_min_rate" : 16,
            "ofp_packet_queue" : 8,
            "ofp_queue_get_config_request" : 16,
            "ofp_queue_get_config_reply" : 16,
            "ofp_action_set_queue" : 8,
            "ofp_queue_stats_request" : 8,
            "ofp_queue_stats" : 32
        },
    };

/* create bitmaps */
(function() {
    module.exports.ofp_action_type_flags = {};
    Object.keys(module.exports.ofp_action_type).forEach(function(key) {
                                        var val = module.exports.ofp_action_type[key];
                                        if (val < 32) {
                                            module.exports.ofp_action_type_flags[key] = 1 << val;
                                        }
                                    });

    module.exports.ofp_instruction_type_flags = {};
    Object.keys(module.exports.ofp_instruction_type).forEach(function(key) {
                                        var val = module.exports.ofp_instruction_type[key];
                                        if (val < 32) {
                                            module.exports.ofp_instruction_type_flags[key] = 1 << val;
                                        }
                                    });
}());

/* create reverse mapping */
(function() {
    var mapKeys = Object.keys(module.exports).filter(function(k) {
                                                    return ((k.indexOf('ofp_') == 0) &&
                                                            (typeof module.exports[k] == 'object')) });

    for (var i = 0; i < mapKeys.length; i++) {
        var newMapKey =  mapKeys[i] + "_rev";
        module.exports[newMapKey] = {};

        var map = module.exports[mapKeys[i]];
        var keys =  Object.keys(map);

        for (var j = 0; j < keys.length; j++) {
            var key = keys[j];
            var val = map[key];

            module.exports[newMapKey][map[key]] = keys[j];
        }
    }

}())