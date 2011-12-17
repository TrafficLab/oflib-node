/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
            0x00, 0x05,             // type = 5
            0x00, 0x08,             // length = 8
            0xc0, 0xa8, 0x02, 0x03  // nw_addr = "192.168.2.3"
        ];


module.exports.obj = {
                header : {type : 'OFPAT_SET_NW_SRC'},
                body : {nw_addr : '192.168.2.3'}
            };
