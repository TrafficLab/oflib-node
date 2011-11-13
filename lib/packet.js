/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

var util = require('util');

module.exports = {
        "ETH_TYPE_II_START" :     0x0600,
        "ETH_TYPE_IP" :           0x0800,
        "ETH_TYPE_ARP" :          0x0806,
        "ETH_TYPE_VLAN" :         0x8100,
        "ETH_TYPE_VLAN_PBB" :     0x88a8,
        "ETH_TYPE_MPLS" :         0x8847,
        "ETH_TYPE_MPLS_MCAST" :   0x8848,

        "ETH_ADDR_LEN" :          6,

        "VLAN_VID_MASK" : 0x0fff,
        "VLAN_VID_SHIFT" : 0,
        "VLAN_PCP_MASK" : 0xe000,
        "VLAN_PCP_SHIFT" : 13,
        "VLAN_PCP_BITMASK" : 0x0007, /* the least 3-bit is valid */

        "VLAN_VID_MAX" : 4095,
        "VLAN_PCP_MAX" : 7,


        "MPLS_TTL_MASK" : 0x000000ff,
        "MPLS_TTL_SHIFT" : 0,
        "MPLS_S_MASK" : 0x00000100,
        "MPLS_S_SHIFT" : 8,
        "MPLS_TC_MASK" : 0x00000e00,
        "MPLS_TC_SHIFT" : 9,
        "MPLS_LABEL_MASK" : 0xfffff000,
        "MPLS_LABEL_SHIFT" : 12,

        "MPLS_LABEL_MAX" :  0xfffff,
        "MPLS_TC_MAX" :        0x07,


        "IP_ECN_MASK " : 0x03,
        "IP_ECN_MAX  " : 0x03,
        "IP_DSCP_MASK" : 0xfc,
        "IP_DSCP_MAX " : 0x3f,

        "ETH_NONE" :  new Buffer([0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
        "ETH_ALL" : new Buffer([0xff, 0xff, 0xff, 0xff, 0xff, 0xff]),
        "IPV4_NONE" : new Buffer([0x00, 0x00, 0x00, 0x00]),
        "IPV4_ALL" : new Buffer([0xff, 0xff, 0xff, 0xff]),

        "ethToString" : function ethToString(buffer, offset) {
            return buffer.toString('hex', offset    , offset + 1) + ':' +
                   buffer.toString('hex', offset + 1, offset + 2) + ':' +
                   buffer.toString('hex', offset + 2, offset + 3) + ':' +
                   buffer.toString('hex', offset + 3, offset + 4) + ':' +
                   buffer.toString('hex', offset + 4, offset + 5) + ':' +
                   buffer.toString('hex', offset + 5, offset + 6);
        },

        "ipv4ToString" : function ipv4ToString(buffer, offset) {
            return util.format('%d.%d.%d.%d', buffer.readUInt8(offset    , true),
                                              buffer.readUInt8(offset + 1, true),
                                              buffer.readUInt8(offset + 2, true),
                                              buffer.readUInt8(offset + 3, true))
        }
    }
