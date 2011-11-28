/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

var util = require('util');

module.exports = {
        ETH_TYPE_II_START :     0x0600,
        ETH_TYPE_IP :           0x0800,
        ETH_TYPE_ARP :          0x0806,
        ETH_TYPE_VLAN :         0x8100,
        ETH_TYPE_VLAN_PBB :     0x88a8,
        ETH_TYPE_MPLS :         0x8847,
        ETH_TYPE_MPLS_MCAST :   0x8848,

        ETH_ADDR_LEN :          6,

        VLAN_VID_MASK : 0x0fff,
        VLAN_VID_SHIFT : 0,
        VLAN_PCP_MASK : 0xe000,
        VLAN_PCP_SHIFT : 13,
        VLAN_PCP_BITMASK : 0x0007, /* the least 3-bit is valid */

        VLAN_VID_MAX : 4095,
        VLAN_PCP_MAX : 7,


        MPLS_TTL_MASK : 0x000000ff,
        MPLS_TTL_SHIFT : 0,
        MPLS_S_MASK : 0x00000100,
        MPLS_S_SHIFT : 8,
        MPLS_TC_MASK : 0x00000e00,
        MPLS_TC_SHIFT : 9,
        MPLS_LABEL_MASK : 0xfffff000,
        MPLS_LABEL_SHIFT : 12,

        MPLS_LABEL_MAX :  0xfffff,
        MPLS_TC_MAX :        0x07,


        IP_ECN_MASK  : 0x03,
        IP_ECN_MAX   : 0x03,
        IP_DSCP_MASK : 0xfc,
        IP_DSCP_MAX  : 0x3f,

        isEthNone : function(buf, offset) {
                            if (buf[offset + 0] != 0x00) return false; if (buf[offset + 1] != 0x00) return false;
                            if (buf[offset + 2] != 0x00) return false; if (buf[offset + 3] != 0x00) return false;
                            if (buf[offset + 4] != 0x00) return false; if (buf[offset + 5] != 0x00) return false;
                            return true;
                        },

        isEthAll : function(buf, offset) {
                            if (buf[offset + 0] != 0xff) return false; if (buf[offset + 1] != 0xff) return false;
                            if (buf[offset + 2] != 0xff) return false; if (buf[offset + 3] != 0xff) return false;
                            if (buf[offset + 4] != 0xff) return false; if (buf[offset + 5] != 0xff) return false;
                            return true;
                        },

        isIPv4None : function(buf, offset) { return buf.readUInt32BE(offset, true) == 0x00000000; },
        isIPv4All : function(buf, offset) { return buf.readUInt32BE(offset, true) == 0xffffffff; },

        ethToString : function ethToString(buffer, offset) {
            return buffer.toString('hex', offset    , offset + 1) + ':' +
                   buffer.toString('hex', offset + 1, offset + 2) + ':' +
                   buffer.toString('hex', offset + 2, offset + 3) + ':' +
                   buffer.toString('hex', offset + 3, offset + 4) + ':' +
                   buffer.toString('hex', offset + 4, offset + 5) + ':' +
                   buffer.toString('hex', offset + 5, offset + 6);
        },

        stringToEth : function stringToEth(string, buffer, offset) {
                            //TODO error handling
                            var eth = /^([0-9A-Fa-f]{2}):([0-9A-Fa-f]{2}):([0-9A-Fa-f]{2}):([0-9A-Fa-f]{2}):([0-9A-Fa-f]{2}):([0-9A-Fa-f]{2})$/.exec(string);
                            buffer.writeUInt8(parseInt(eth[1], 16), offset    , true); // i+1 because whole match is at loc. 0
                            buffer.writeUInt8(parseInt(eth[2], 16), offset + 1, true);
                            buffer.writeUInt8(parseInt(eth[3], 16), offset + 2, true);
                            buffer.writeUInt8(parseInt(eth[4], 16), offset + 3, true);
                            buffer.writeUInt8(parseInt(eth[5], 16), offset + 4, true);
                            buffer.writeUInt8(parseInt(eth[6], 16), offset + 5, true);
        },

        ipv4ToString : function ipv4ToString(buffer, offset) {
            return util.format('%d.%d.%d.%d', buffer.readUInt8(offset    , true),
                                              buffer.readUInt8(offset + 1, true),
                                              buffer.readUInt8(offset + 2, true),
                                              buffer.readUInt8(offset + 3, true))
        },

        stringToIPv4 : function stringToIPv4(string, buffer, offset) {
                            //TODO error handling
                            var ip = /^([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])\.([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])\.([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])\.([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])$/.exec(string);
                            buffer.writeUInt8(parseInt(ip[1]), offset    , true); // i+1 because whole match is at loc. 0
                            buffer.writeUInt8(parseInt(ip[2]), offset + 1, true);
                            buffer.writeUInt8(parseInt(ip[3]), offset + 2, true);
                            buffer.writeUInt8(parseInt(ip[4]), offset + 3, true);
        },
    }
