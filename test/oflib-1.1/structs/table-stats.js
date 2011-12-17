/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
                0x0d,                                            // table_id = 13
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,        // pad
                0x54, 0x61, 0x62, 0x6c, 0x65, 0x20, 0x31, 0x33,
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,  // name = "Table 13"
                0x00, 0x00, 0x00, 0x07,                          // wildcards = 0111
                0x00, 0x00, 0x00, 0x55,                          // match = 0101 0101
                0x00, 0x00, 0x00, 0x30,                          // instructions = 0011 0000
                0x00, 0x00, 0x00, 0x03,                          // write_actions = 0011
                0x00, 0x00, 0x00, 0x0c,                          // apply_actions = 1100
                0x00, 0x00, 0x00, 0x01,                          // config = 0001
                0x00, 0x00, 0x00, 0x50,                          // max_entries = 80
                0x00, 0x00, 0x00, 0x30,                          // active_count = 48
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x05,  // lookup_count = 5
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03   // matched_count = 3
        ];

module.exports.obj = {
                "table_id" : 13,
                "name" : "Table 13",
                "wildcards" : ['OFPFW_IN_PORT', 'OFPFW_DL_VLAN', 'OFPFW_DL_VLAN_PCP'],
                "match" : ['OFPFMF_IN_PORT', 'OFPFMF_DL_VLAN_PCP', 'OFPFMF_NW_TOS', 'OFPFMF_TP_SRC'],
                "instructions" : ['OFPIT_APPLY_ACTIONS', 'OFPIT_CLEAR_ACTIONS'],
                "write_actions" : ['OFPAT_OUTPUT', 'OFPAT_SET_VLAN_VID'],
                "apply_actions" : ['OFPAT_SET_VLAN_PCP', 'OFPAT_SET_DL_SRC'],
                "config" : ['OFPTC_TABLE_MISS_CONTINUE'],
                "max_entries" : 80,
                "active_count" : 48,
                "lookup_count" : [0, 5],
                "matched_count" : [0, 3]
            };
