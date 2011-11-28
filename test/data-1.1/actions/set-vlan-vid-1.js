/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
        0x00, 0x01,   // type = 1
        0x00, 0x08,   // length = 8
        0x02, 0xff,   // vlan_vid = 767
        0x00, 0x00,   // padding
    ];

module.exports.obj = {
        header : {type : 'OFPAT_SET_VLAN_VID'},
        body : {vlan_vid : 767}
    };

