/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
            0x00, 0x02,        // type = 2
            0x00, 0x08,        // length = 8
            0x03,              // vlan_pcp = 3
            0x00, 0x00, 0x00,  // padding
        ];

module.exports.obj = {
                "header" : {"type" : 'OFPAT_SET_VLAN_PCP'},
                "body" : {"vlan_pcp" : 3}
            };
