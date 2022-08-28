{
  "targets": [{
    "target_name": "yaz0_node",
    "include_dirs": [
      "libyaz0/include",
      "<!(node -p \"require('node-addon-api').include_dir\")"
    ],
    "defines": [ "NAPI_DISABLE_CPP_EXCEPTIONS" ],
    "sources": [
      "src/node/yaz0_node.cc",
      "libyaz0/src/libyaz0/compress.c",
      "libyaz0/src/libyaz0/decompress.c",
      "libyaz0/src/libyaz0/libyaz0.c",
      "libyaz0/src/libyaz0/util.c",
    ]
  }]
}
