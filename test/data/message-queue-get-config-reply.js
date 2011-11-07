/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

module.exports.bin = [
                0x02,                          // version = 2
                0x17,                          // type = 23
                0x00, 0x40,                    // length = 64
                0x49, 0x96, 0x02, 0xd2,        // xid = 1234567890
                  0x00, 0x00, 0x00, 0x12,             // port_no = 18,
                  0x00, 0x00, 0x00, 0x00,             // pad
                    0x00, 0x00, 0x00, 0x10,             // queue_id = 16
                    0x00, 0x18,                         // length = 24
                    0x00, 0x00,                         // pad
                        0x00, 0x01,                          // property = 1
                        0x00, 0x10,                          // length = 16
                        0x00, 0x00, 0x00, 0x00,              // pad
                          0x00, 0xfe,                         // rate = 254
                          0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // pad
                    0x00, 0x00, 0x00, 0x12,             // queue_id = 18
                    0x00, 0x18,                         // length = 24
                    0x00, 0x00,                         // pad
                        0x00, 0x01,                          // property = 1
                        0x00, 0x10,                          // length = 16
                        0x00, 0x00, 0x00, 0x00,              // pad
                          0x00, 0xfc,                         // rate = 252
                          0x00, 0x00, 0x00, 0x00, 0x00, 0x00  // pad
            ];

module.exports.json = {
                "version" : 2,
                "header" : {
                    "type" : 'OFPT_QUEUE_GET_CONFIG_REPLY',
                    "xid" : 1234567890
                },
                "body" : {
                    "port" : 18,
                    "queues" : [
                        {
                            "queue_id" : 16,
                            "properties" : [
                                {
                                    "header" : {"property" : 'OFPQT_MIN_RATE'},
                                    "body" : {"rate" : 254}
                                }
                            ]
                        },
                        {
                            "queue_id" : 18,
                            "properties" : [
                                {
                                    "header" : {"property" : 'OFPQT_MIN_RATE'},
                                    "body" : {"rate" : 252}
                                }
                            ]
                        }
                    ]
                }
            };
