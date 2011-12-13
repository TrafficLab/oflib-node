/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports = {
        "OFP_VERSION" : 0x01,

        "OFP_MAX_TABLE_NAME_LEN" : 32,
        "OFP_MAX_PORT_NAME_LEN"  : 16,

        "OFP_ETH_ALEN" : 6,          /* Bytes in an Ethernet address. */

        /* Port numbering.  Physical ports are numbered starting from 1. */
        "ofp_port" : {
            /* Maximum number of physical switch ports. */
            "OFPP_MAX" : 0xff00,

            /* Fake output "ports". */
            "OFPP_IN_PORT"    : 0xfff8,  /* Send the packet out the input port.  This
                                            virtual port must be explicitly used
                                            in order to send back out of the input
                                            port. */
            "OFPP_TABLE"      : 0xfff9,  /* Perform actions in flow table.
                                            NB: This can only be the destination
                                            port for packet-out messages. */
            "OFPP_NORMAL"     : 0xfffa,  /* Process with normal L2/L3 switching. */
            "OFPP_FLOOD"      : 0xfffb,  /* All physical ports except input port and
                                            those disabled by STP. */
            "OFPP_ALL"        : 0xfffc,  /* All physical ports except input port. */
            "OFPP_CONTROLLER" : 0xfffd,  /* Send to controller. */
            "OFPP_LOCAL"      : 0xfffe,  /* Local openflow "port". */
            "OFPP_NONE"       : 0xffff   /* Not associated with a physical port. */
        },

        "ofp_type" : {
            /* Immutable messages. */
            "OFPT_HELLO"        : 0,        /* Symmetric message */
            "OFPT_ERROR"        : 1,        /* Symmetric message */
            "OFPT_ECHO_REQUEST" : 2,        /* Symmetric message */
            "OFPT_ECHO_REPLY"   : 3,        /* Symmetric message */
            "OFPT_VENDOR"       : 4,        /* Symmetric message */

            /* Switch configuration messages. */
            "OFPT_FEATURES_REQUEST"   : 5,  /* Controller/switch message */
            "OFPT_FEATURES_REPLY"     : 6,  /* Controller/switch message */
            "OFPT_GET_CONFIG_REQUEST" : 7,  /* Controller/switch message */
            "OFPT_GET_CONFIG_REPLY"   : 8,  /* Controller/switch message */
            "OFPT_SET_CONFIG"         : 9,  /* Controller/switch message */

            /* Asynchronous messages. */
            "OFPT_PACKET_IN"    : 10,       /* Async message */
            "OFPT_FLOW_REMOVED" : 11,       /* Async message */
            "OFPT_PORT_STATUS"  : 12,       /* Async message */

            /* Controller command messages. */
            "OFPT_PACKET_OUT" : 13,         /* Controller/switch message */
            "OFPT_FLOW_MOD"   : 14,         /* Controller/switch message */
            "OFPT_PORT_MOD"   : 15,         /* Controller/switch message */

            /* Statistics messages. */
            "OFPT_STATS_REQUEST" : 16,      /* Controller/switch message */
            "OFPT_STATS_REPLY"   : 17,      /* Controller/switch message */

            /* Barrier messages. */
            "OFPT_BARRIER_REQUEST" : 18,    /* Controller/switch message */
            "OFPT_BARRIER_REPLY"   : 19,    /* Controller/switch message */

            /* Queue Configuration messages. */
            "OFPT_QUEUE_GET_CONFIG_REQUEST" : 20,  /* Controller/switch message */
            "OFPT_QUEUE_GET_CONFIG_REPLY"   : 21   /* Controller/switch message */
        },

        "OFP_DEFAULT_MISS_SEND_LEN" : 128,

        "ofp_config_flags" : {
            /* Handling of IP fragments. */
            "OFPC_FRAG_NORMAL"  : 0,  /* No special handling for fragments. */
            "OFPC_FRAG_DROP"    : 1,  /* Drop fragments. */
            "OFPC_FRAG_REASM"   : 2,  /* Reassemble (only if OFPC_IP_REASM set). */
            "OFPC_FRAG_MASK"    : 3
        },

        /* Capabilities supported by the datapath. */
        "ofp_capabilities" : {
            "OFPC_FLOW_STATS"     : 1 << 0,  /* Flow statistics. */
            "OFPC_TABLE_STATS"    : 1 << 1,  /* Table statistics. */
            "OFPC_PORT_STATS"     : 1 << 2,  /* Port statistics. */
            "OFPC_STP"            : 1 << 3,  /* 802.1d spanning tree. */
            "OFPC_RESERVED"       : 1 << 4,  /* Reserved, must be zero. */
            "OFPC_IP_REASM"       : 1 << 5,  /* Can reassemble IP fragments. */
            "OFPC_QUEUE_STATS"    : 1 << 6,  /* Queue statistics. */
            "OFPC_ARP_MATCH_IP"   : 1 << 7   /* Match IP addresses in ARP pkts. */
        },

        /* Flags to indicate behavior of the physical port.  These flags are
         * used in ofp_phy_port to describe the current configuration.  They are
          * used in the ofp_port_mod message to configure the port's behavior.
         */
        "ofp_port_config" : {
            "OFPPC_PORT_DOWN"    : 1 << 0,  /* Port is administratively down. */

            "OFPPC_NO_STP"       : 1 << 1,  /* Disable 802.1D spanning tree on port. */
            "OFPPC_NO_RECV"      : 1 << 2,  /* Drop all packets except 802.1D spanning
                                               tree packets. */
            "OFPPC_NO_RECV_STP"  : 1 << 3,  /* Drop received 802.1D STP packets. */
            "OFPPC_NO_FLOOD"     : 1 << 4,  /* Do not include this port when flooding. */
            "OFPPC_NO_FWD"       : 1 << 5,  /* Drop packets forwarded to port. */
            "OFPPC_NO_PACKET_IN" : 1 << 6   /* Do not send packet-in msgs for port. */
        },

        /* Current state of the physical port.  These are not configurable from
         * the controller.
         */
        "ofp_port_state" : {
            "OFPPS_LINK_DOWN"   : 1 << 0, /* No physical link present. */

            /* The OFPPS_STP_* bits have no effect on switch operation.  The
             * controller must adjust OFPPC_NO_RECV, OFPPC_NO_FWD, and
             * OFPPC_NO_PACKET_IN appropriately to fully implement an 802.1D spanning
             * tree. */
            "OFPPS_STP_LISTEN"  : 0 << 8, /* Not learning or relaying frames. */
            "OFPPS_STP_LEARN"   : 1 << 8, /* Learning but not relaying frames. */
            "OFPPS_STP_FORWARD" : 2 << 8, /* Learning and relaying frames. */
            "OFPPS_STP_BLOCK"   : 3 << 8, /* Not part of spanning tree. */
            "OFPPS_STP_MASK"    : 3 << 8  /* Bit mask for OFPPS_STP_* values. */
        },

        /* Features of physical ports available in a datapath. */
        "ofp_port_features" : {
            "OFPPF_10MB_HD"    : 1 << 0,  /* 10 Mb half-duplex rate support. */
            "OFPPF_10MB_FD"    : 1 << 1,  /* 10 Mb full-duplex rate support. */
            "OFPPF_100MB_HD"   : 1 << 2,  /* 100 Mb half-duplex rate support. */
            "OFPPF_100MB_FD"   : 1 << 3,  /* 100 Mb full-duplex rate support. */
            "OFPPF_1GB_HD"     : 1 << 4,  /* 1 Gb half-duplex rate support. */
            "OFPPF_1GB_FD"     : 1 << 5,  /* 1 Gb full-duplex rate support. */
            "OFPPF_10GB_FD"    : 1 << 6,  /* 10 Gb full-duplex rate support. */
            "OFPPF_COPPER"     : 1 << 7,  /* Copper medium. */
            "OFPPF_FIBER"      : 1 << 8,  /* Fiber medium. */
            "OFPPF_AUTONEG"    : 1 << 9,  /* Auto-negotiation. */
            "OFPPF_PAUSE"      : 1 << 10, /* Pause. */
            "OFPPF_PAUSE_ASYM" : 1 << 11  /* Asymmetric pause. */
        },

        /* What changed about the physical port */
        "ofp_port_reason" : {
            "OFPPR_ADD"    : 0,       /* The port was added. */
            "OFPPR_DELETE" : 1,       /* The port was removed. */
            "OFPPR_MODIFY" : 2        /* Some attribute of the port has changed. */
        },

        /* Why is this packet being sent to the controller? */
        "ofp_packet_in_reason" : {
            "OFPR_NO_MATCH" : 0,          /* No matching flow. */
            "OFPR_ACTION"   : 1,          /* Action explicitly output to controller. */
        },

        "ofp_action_type" : {
            "OFPAT_OUTPUT"       :  0,     /* Output to switch port. */
            "OFPAT_SET_VLAN_VID" :  1,     /* Set the 802.1q VLAN id. */
            "OFPAT_SET_VLAN_PCP" :  2,     /* Set the 802.1q priority. */
            "OFPAT_STRIP_VLAN"   :  3,    /* Strip the 802.1q header. */
            "OFPAT_SET_DL_SRC"   :  4,    /* Ethernet source address. */
            "OFPAT_SET_DL_DST"   :  5,    /* Ethernet destination address. */
            "OFPAT_SET_NW_SRC"   :  6,    /* IP source address. */
            "OFPAT_SET_NW_DST"   :  7,    /* IP destination address. */
            "OFPAT_SET_NW_TOS"   :  8,    /* IP ToS (DSCP field, 6 bits). */
            "OFPAT_SET_TP_SRC"   :  9,    /* TCP/UDP source port. */
            "OFPAT_SET_TP_DST"   : 10,    /* TCP/UDP destination port. */
            "OFPAT_ENQUEUE"      : 11,    /* Output to queue.  */
            "OFPAT_VENDOR"       : 0xffff
        },

        /* The VLAN id is 12 bits, so we can use the entire 16 bits to indicate
         * special conditions.  All ones is used to match that no VLAN id was
         * set. */
        "OFP_VLAN_NONE" :      0xffff,

        "ofp_flow_mod_command" : {
            "OFPFC_ADD"           : 0,   /* New flow. */
            "OFPFC_MODIFY"        : 1,   /* Modify all matching flows. */
            "OFPFC_MODIFY_STRICT" : 2,   /* Modify entry strictly matching wildcards */
            "OFPFC_DELETE"        : 3,   /* Delete all matching flows. */
            "OFPFC_DELETE_STRICT" : 4    /* Strictly match wildcards and priority. */
        },

        /* Flow wildcards. */
        "ofp_flow_wildcards" : {
            "OFPFW_IN_PORT"  : 1 << 0,  /* Switch input port. */
            "OFPFW_DL_VLAN"  : 1 << 1,  /* VLAN id. */
            "OFPFW_DL_SRC"   : 1 << 2,  /* Ethernet source address. */
            "OFPFW_DL_DST"   : 1 << 3,  /* Ethernet destination address. */
            "OFPFW_DL_TYPE"  : 1 << 4,  /* Ethernet frame type. */
            "OFPFW_NW_PROTO" : 1 << 5,  /* IP protocol. */
            "OFPFW_TP_SRC"   : 1 << 6,  /* TCP/UDP source port. */
            "OFPFW_TP_DST"   : 1 << 7,  /* TCP/UDP destination port. */

            "OFPFW_DL_VLAN_PCP" : 1 << 20,  /* VLAN priority. */
            "OFPFW_NW_TOS" : 1 << 21,  /* IP ToS (DSCP field, 6 bits). */
        },

        /* IP source address wildcard bit count.  0 is exact match, 1 ignores the
         * LSB, 2 ignores the 2 least-significant bits, ..., 32 and higher wildcard
         * the entire field.  This is the *opposite* of the usual convention where
         * e.g. /24 indicates that 8 bits (not 24 bits) are wildcarded. */
        "OFPFW_NW_SRC_SHIFT" : 8,
        "OFPFW_NW_SRC_BITS" : 6,
        "OFPFW_NW_SRC_MASK" : ((1 << 6) - 1) << 8,
        "OFPFW_NW_SRC_ALL" : 32 << 8,

        /* IP destination address wildcard bit count.  Same format as source. */
        "OFPFW_NW_DST_SHIFT" : 14,
        "OFPFW_NW_DST_BITS" : 6,
        "OFPFW_NW_DST_MASK" : ((1 << 6) - 1) << 14,
        "OFPFW_NW_DST_ALL" : 32 << 14,

        "ofp_flow_mod_flags" : {
            "OFPFF_SEND_FLOW_REM" : 1 << 0,  /* Send flow removed message when flow
                                    * expires or is deleted. */
            "OFPFF_CHECK_OVERLAP" : 1 << 1,  /* Check for overlapping entries first. */
            "OFPFF_EMERG"         : 1 << 2   /* Remark this is for emergency. */
        },

        /* Why was this flow removed? */
        "ofp_flow_removed_reason" : {
            "OFPRR_IDLE_TIMEOUT" : 0,         /* Flow idle time exceeded idle_timeout. */
            "OFPRR_HARD_TIMEOUT" : 1,         /* Time exceeded hard_timeout. */
            "OFPRR_DELETE"       : 2          /* Evicted by a DELETE flow mod. */
        },

        /* Values for 'type' in ofp_error_message.  These values are immutable: they
         * will not change in future versions of the protocol (although new values may
         * be added). */
        "ofp_error_type" : {
            "OFPET_HELLO_FAILED"    : 0,      /* Hello protocol failed. */
            "OFPET_BAD_REQUEST"     : 1,      /* Request was not understood. */
            "OFPET_BAD_ACTION"      : 2,      /* Error in action description. */
            "OFPET_FLOW_MOD_FAILED" : 3,      /* Problem modifying flow entry. */
            "OFPET_PORT_MOD_FAILED" : 4,      /* Port mod request failed. */
            "OFPET_QUEUE_OP_FAILED" : 5       /* Queue operation failed. */
        },

        /* ofp_error_msg 'code' values for OFPET_HELLO_FAILED.  'data' contains an
         * ASCII text string that may give failure details. */
        "ofp_hello_failed_code" : {
            "OFPHFC_INCOMPATIBLE" : 0,        /* No compatible version. */
            "OFPHFC_EPERM"        : 1         /* Permissions error. */
        },

        /* ofp_error_msg 'code' values for OFPET_BAD_REQUEST.  'data' contains at least
         * the first 64 bytes of the failed request. */
        "ofp_bad_request_code" : {
            "OFPBRC_BAD_VERSION"    : 0,      /* ofp_header.version not supported. */
            "OFPBRC_BAD_TYPE"       : 1,      /* ofp_header.type not supported. */
            "OFPBRC_BAD_STAT"       : 2,      /* ofp_stats_request.type not supported. */
            "OFPBRC_BAD_VENDOR"     : 3,      /* Vendor not supported (in ofp_vendor_header
                                               * or ofp_stats_request or ofp_stats_reply). */
            "OFPBRC_BAD_SUBTYPE"    : 4,      /* Vendor subtype not supported. */
            "OFPBRC_EPERM"          : 5,      /* Permissions error. */
            "OFPBRC_BAD_LEN"        : 6,      /* Wrong request length for type. */
            "OFPBRC_BUFFER_EMPTY"   : 7,      /* Specified buffer has already been used. */
            "OFPBRC_BUFFER_UNKNOWN" : 8       /* Specified buffer does not exist. */
        },

        /* ofp_error_msg 'code' values for OFPET_BAD_ACTION.  'data' contains at least
         * the first 64 bytes of the failed request. */
        "ofp_bad_action_code" : {
            "OFPBAC_BAD_TYPE"        : 0,   /* Unknown action type. */
            "OFPBAC_BAD_LEN"         : 1,   /* Length problem in actions. */
            "OFPBAC_BAD_VENDOR"      : 2,   /* Unknown vendor id specified. */
            "OFPBAC_BAD_VENDOR_TYPE" : 3,   /* Unknown action type for vendor id. */
            "OFPBAC_BAD_OUT_PORT"    : 4,   /* Problem validating output action. */
            "OFPBAC_BAD_ARGUMENT"    : 5,   /* Bad action argument. */
            "OFPBAC_EPERM"           : 6,   /* Permissions error. */
            "OFPBAC_TOO_MANY"        : 7,   /* Can't handle this many actions. */
            "OFPBAC_BAD_QUEUE"       : 8    /* Problem validating output queue. */
        },

        /* ofp_error_msg 'code' values for OFPET_FLOW_MOD_FAILED.  'data' contains
         * at least the first 64 bytes of the failed request. */
        "ofp_flow_mod_failed_code" : {
            "OFPFMFC_ALL_TABLES_FULL"   : 0, /* Flow not added because of full tables. */
            "OFPFMFC_OVERLAP"           : 1, /* Attempted to add overlapping flow with
                                              * CHECK_OVERLAP flag set. */
            "OFPFMFC_EPERM"             : 2, /* Permissions error. */
            "OFPFMFC_BAD_EMERG_TIMEOUT" : 3, /* Flow not added because of non-zero idle/hard
                                              * timeout. */
            "OFPFMFC_BAD_COMMAND"       : 4, /* Unknown command. */
            "OFPFMFC_UNSUPPORTED"       : 5  /* Unsupported action list - cannot process in
                                              * the order specified. */
        },

        /* ofp_error_msg 'code' values for OFPET_PORT_MOD_FAILED.  'data' contains
         * at least the first 64 bytes of the failed request. */
        "ofp_port_mod_failed_code" : {
            "OFPPMFC_BAD_PORT"    : 0,        /* Specified port does not exist. */
            "OFPPMFC_BAD_HW_ADDR" : 1         /* Specified hardware address is wrong. */
        },

        /* ofp_error msg 'code' values for OFPET_QUEUE_OP_FAILED. 'data' contains
         * at least the first 64 bytes of the failed request */
        "ofp_queue_op_failed_code" : {
            "OFPQOFC_BAD_PORT"  : 0,         /* Invalid port (or port does not exist). */
            "OFPQOFC_BAD_QUEUE" : 1,         /* Queue does not exist. */
            "OFPQOFC_EPERM"     : 2          /* Permissions error. */
        },

        "ofp_stats_types" : {
            /* Description of this OpenFlow switch.
             * The request body is empty.
             * The reply body is struct ofp_desc_stats. */
            "OFPST_DESC" : 0,

            /* Individual flow statistics.
             * The request body is struct ofp_flow_stats_request.
             * The reply body is an array of struct ofp_flow_stats. */
            "OFPST_FLOW": 1,

            /* Aggregate flow statistics.
             * The request body is struct ofp_aggregate_stats_request.
             * The reply body is struct ofp_aggregate_stats_reply. */
            "OFPST_AGGREGATE": 2,

            /* Flow table statistics.
             * The request body is empty.
             * The reply body is an array of struct ofp_table_stats. */
            "OFPST_TABLE": 3,

            /* Physical port statistics.
             * The request body is struct ofp_port_stats_request.
             * The reply body is an array of struct ofp_port_stats. */
            "OFPST_PORT": 4,

            /* Queue statistics for a port
             * The request body defines the port
             * The reply body is an array of struct ofp_queue_stats */
            "OFPST_QUEUE": 5,

            /* Vendor extension.
             * The request and reply bodies begin with a 32-bit vendor ID, which takes
             * the same form as in "struct ofp_vendor_header".  The request and reply
             * bodies are otherwise vendor-defined. */
            "OFPST_VENDOR" : 0xffff
        },

        "ofp_stats_reply_flags" : {
            "OFPSF_REPLY_MORE" : 1 << 0  /* More replies to follow. */
        },

        "DESC_STR_LEN"   : 256,
        "SERIAL_NUM_LEN" : 32,

        /* All ones is used to indicate all queues in a port (for stats retrieval). */
        "OFPQ_ALL" :     0xffffffff,

        "ofp_queue_properties" : {
            "OFPQT_NONE"     : 0,       /* No property defined for queue (default). */
            "OFPQT_MIN_RATE" : 1,       /* Minimum datarate guaranteed. */
                                        /* Other types should be added here
                                         * (i.e. max rate, precedence, etc). */
        },

        "ofp_table" : {
            "OFPTT_MAX" : 253,
            "OFPTT_EMERG" : 254,
            "OFPTT_ALL" : 255
        },


        "sizes" : {
            "ofp_header" : 8,
            "ofp_hello" : 8,
            "ofp_switch_config" : 12,
            "ofp_phy_port" : 48,
            "ofp_switch_features" : 32,
            "ofp_port_status" : 64,
            "ofp_port_mod" : 32,
            "ofp_packet_in" : 20,
            "ofp_action_output" : 8,
            "ofp_action_vlan_vid" : 8,
            "ofp_action_vlan_pcp" : 8,
            "ofp_action_dl_addr" : 16,
            "ofp_action_nw_addr" : 8,
            "ofp_action_tp_port" : 8,
            "ofp_action_nw_tos" : 8,
            "ofp_action_vendor_header" : 8,
            "ofp_action_header" : 8,
            "ofp_packet_out" : 16,
            "ofp_match" : 40,
            "ofp_flow_mod" : 72,
            "ofp_flow_removed" : 88,
            "ofp_error_msg" : 12,
            "ofp_stats_request" : 12,
            "ofp_stats_reply" : 12,
            "ofp_desc_stats" : 1056,
            "ofp_flow_stats_request" : 44,
            "ofp_flow_stats" : 88,
            "ofp_aggregate_stats_request" : 44,
            "ofp_aggregate_stats_reply" : 24,
            "ofp_table_stats" : 64,
            "ofp_port_stats_request" : 8,
            "ofp_port_stats" : 104,
            "ofp_vendor_header" : 12,
            "ofp_queue_prop_header" : 8,
            "ofp_queue_prop_min_rate" : 16,
            "ofp_packet_queue" : 8,
            "ofp_queue_get_config_request" : 12,
            "ofp_queue_get_config_reply" : 16,
            "ofp_action_enqueue" : 16,
            "ofp_queue_stats_request" : 8,
            "ofp_queue_stats" : 32
        },

        "offsets" : {
            "ofp_header" : {
                "version" : 0,
                "type" : 1,
                "length" : 2,
                "xid" : 4,
            },
            "ofp_hello" : {
                "header" : 0,
            },
            "ofp_switch_config" : {
                "header" : 0,
                "flags" : 8,
                "miss_send_len" : 10,
            },
            "ofp_phy_port" : {
                "port_no" : 0,
                "hw_addr" : 2,
                "name" : 8,
                "config" : 24,
                "state" : 28,
                "curr" : 32,
                "advertised" : 36,
                "supported" : 40,
                "peer" : 44,
            },
            "ofp_switch_features" : {
                "header" : 0,
                "datapath_id" : 8,
                "n_buffers" : 16,
                "n_tables" : 20,
                "pad" : 21,
                "capabilities" : 24,
                "actions" : 28,
                "ports" : 32,
            },
            "ofp_port_status" : {
                "header" : 0,
                "reason" : 8,
                "pad" : 9,
                "desc" : 16,
            },
            "ofp_port_mod" : {
                "header" : 0,
                "port_no" : 8,
                "hw_addr" : 10,
                "config" : 16,
                "mask" : 20,
                "advertise" : 24,
                "pad" : 28,
            },
            "ofp_packet_in" : {
                "header" : 0,
                "buffer_id" : 8,
                "total_len" : 12,
                "in_port" : 14,
                "reason" : 16,
                "pad" : 17,
                "data" : 18,
            },
            "ofp_action_output" : {
                "type" : 0,
                "len" : 2,
                "port" : 4,
                "max_len" : 6,
            },
            "ofp_action_vlan_vid" : {
                "type" : 0,
                "len" : 2,
                "vlan_vid" : 4,
                "pad" : 6,
            },
            "ofp_action_vlan_pcp" : {
                "type" : 0,
                "len" : 2,
                "vlan_pcp" : 4,
                "pad" : 5,
            },
            "ofp_action_dl_addr" : {
                "type" : 0,
                "len" : 2,
                "dl_addr" : 4,
                "pad" : 10,
            },
            "ofp_action_nw_addr" : {
                "type" : 0,
                "len" : 2,
                "nw_addr" : 4,
            },
            "ofp_action_tp_port" : {
                "type" : 0,
                "len" : 2,
                "tp_port" : 4,
                "pad" : 6,
            },
            "ofp_action_nw_tos" : {
                "type" : 0,
                "len" : 2,
                "nw_tos" : 4,
                "pad" : 5,
            },
            "ofp_action_vendor_header" : {
                "type" : 0,
                "len" : 2,
                "vendor" : 4,
            },
            "ofp_action_header" : {
                "type" : 0,
                "len" : 2,
                "pad" : 4,
            },
            "ofp_packet_out" : {
                "header" : 0,
                "buffer_id" : 8,
                "in_port" : 12,
                "actions_len" : 14,
                "actions" : 16,
            },
            "ofp_match" : {
                "wildcards" : 0,
                "in_port" : 4,
                "dl_src" : 6,
                "dl_dst" : 12,
                "dl_vlan" : 18,
                "dl_vlan_pcp" : 20,
                "pad1" : 21,
                "dl_type" : 22,
                "nw_tos" : 24,
                "nw_proto" : 25,
                "pad2" : 26,
                "nw_src" : 28,
                "nw_dst" : 32,
                "tp_src" : 36,
                "tp_dst" : 38,
            },
            "ofp_flow_mod" : {
                "header" : 0,
                "match" : 8,
                "cookie" : 48,
                "command" : 56,
                "idle_timeout" : 58,
                "hard_timeout" : 60,
                "priority" : 62,
                "buffer_id" : 64,
                "out_port" : 68,
                "flags" : 70,
                "actions" : 72,
            },
            "ofp_flow_removed" : {
                "header" : 0,
                "match" : 8,
                "cookie" : 48,
                "priority" : 56,
                "reason" : 58,
                "pad" : 59,
                "duration_sec" : 60,
                "duration_nsec" : 64,
                "idle_timeout" : 68,
                "pad2" : 70,
                "packet_count" : 72,
                "byte_count" : 80,
            },
            "ofp_error_msg" : {
                "header" : 0,
                "type" : 8,
                "code" : 10,
                "data" : 12,
            },
            "ofp_stats_request" : {
                "header" : 0,
                "type" : 8,
                "flags" : 10,
                "body" : 12,
            },
            "ofp_stats_reply" : {
                "header" : 0,
                "type" : 8,
                "flags" : 10,
                "body" : 12,
            },
            "ofp_desc_stats" : {
                "mfr_desc" : 0,
                "hw_desc" : 256,
                "sw_desc" : 512,
                "serial_num" : 768,
                "dp_desc" : 800,
            },
            "ofp_flow_stats_request" : {
                "match" : 0,
                "table_id" : 40,
                "pad" : 41,
                "out_port" : 42,
            },
            "ofp_flow_stats" : {
                "length" : 0,
                "table_id" : 2,
                "pad" : 3,
                "match" : 4,
                "duration_sec" : 44,
                "duration_nsec" : 48,
                "priority" : 52,
                "idle_timeout" : 54,
                "hard_timeout" : 56,
                "pad2" : 58,
                "cookie" : 64,
                "packet_count" : 72,
                "byte_count" : 80,
                "actions" : 88,
            },
            "ofp_aggregate_stats_request" : {
                "match" : 0,
                "table_id" : 40,
                "pad" : 41,
                "out_port" : 42,
            },
            "ofp_aggregate_stats_reply" : {
                "packet_count" : 0,
                "byte_count" : 8,
                "flow_count" : 16,
                "pad" : 20,
            },
            "ofp_table_stats" : {
                "table_id" : 0,
                "pad" : 1,
                "name" : 4,
                "wildcards" : 36,
                "max_entries" : 40,
                "active_count" : 44,
                "lookup_count" : 48,
                "matched_count" : 56,
            },
            "ofp_port_stats_request" : {
                "port_no" : 0,
                "pad" : 2,
            },
            "ofp_port_stats" : {
                "port_no" : 0,
                "pad" : 2,
                "rx_packets" : 8,
                "tx_packets" : 16,
                "rx_bytes" : 24,
                "tx_bytes" : 32,
                "rx_dropped" : 40,
                "tx_dropped" : 48,
                "rx_errors" : 56,
                "tx_errors" : 64,
                "rx_frame_err" : 72,
                "rx_over_err" : 80,
                "rx_crc_err" : 88,
                "collisions" : 96,
            },
            "ofp_vendor_header" : {
                "header" : 0,
                "vendor" : 8,
            },
            "ofp_queue_prop_header" : {
                "property" : 0,
                "len" : 2,
                "pad" : 4,
            },
            "ofp_queue_prop_min_rate" : {
                "prop_header" : 0,
                "rate" : 8,
                "pad" : 10,
            },
            "ofp_packet_queue" : {
                "queue_id" : 0,
                "len" : 4,
                "pad" : 6,
                "properties" : 8,
            },
            "ofp_queue_get_config_request" : {
                "header" : 0,
                "port" : 8,
                "pad" : 10,
            },
            "ofp_queue_get_config_reply" : {
                "header" : 0,
                "port" : 8,
                "pad" : 10,
                "queues" : 16,
            },
            "ofp_action_enqueue" : {
                "type" : 0,
                "len" : 2,
                "port" : 4,
                "pad" : 6,
                "queue_id" : 12,
            },
            "ofp_queue_stats_request" : {
                "port_no" : 0,
                "pad" : 2,
                "queue_id" : 4,
            },
            "ofp_queue_stats" : {
                "port_no" : 0,
                "pad" : 2,
                "queue_id" : 4,
                "tx_bytes" : 8,
                "tx_packets" : 16,
                "tx_errors" : 24,
            }
        }
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
}());

/* create reverse mapping */
(function() {
    var mapKeys = Object.keys(module.exports).filter(function(k) {
                                                    return ((k.indexOf('ofp_') == 0) &&
                                                            (typeof module.exports[k] == 'object')) });

    for (var i = 0; i < mapKeys.length; i++) {
        var newMapKey = mapKeys[i] + "_rev";
        module.exports[newMapKey] = {};

        var map = module.exports[mapKeys[i]];
        var keys = Object.keys(map);

        for (var j = 0; j < keys.length; j++) {
            var key = keys[j];
            var val = map[key];

            module.exports[newMapKey][map[key]] = keys[j];
        }
    }

}())

