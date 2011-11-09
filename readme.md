# oflib-node

Oflib-node is an OpenFlow protocol library for Node.
It converts between OpenFlow wire protocol messages and JSON objects.

This version is for OpenFlow 1.1.

## Dependencies

buffertools (https://github.com/bnoordhuis/node-buffertools/)
node-int64 (https://github.com/broofa/node-int64/)

## Notes

At the moment the library only supports unpacking messages.

The returned ofp_error type/codes are not always consistend with the spec.

The schema files are outdated.