/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports = {
    sizes : {
        ofp_header : 8
    },

    offsets : {
        ofp_header : {
            version : 0,
            type : 1,
            length : 2,
            xid : 4
        }
    }
};