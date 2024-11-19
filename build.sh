#!/bin/sh

emcc -Ilibyaz0/include -Oz --closure 1 \
  -sENVIRONMENT=web \
  -sWASM=1 \
  -sEXPORT_ES6=1 \
  -sMODULARIZE=1 \
  -sFILESYSTEM=0 \
  -sMALLOC=emmalloc \
  -sEXPORTED_FUNCTIONS=_malloc,_free,_realloc,_emYaz0Init,_yaz0Destroy,_yaz0ModeDecompress,_yaz0ModeCompress,_yaz0Run,_yaz0Input,_yaz0Output,_yaz0OutputChunkSize,_yaz0DecompressedSize \
  libyaz0/src/libyaz0/compress.c \
  libyaz0/src/libyaz0/decompress.c \
  libyaz0/src/libyaz0/libyaz0.c \
  libyaz0/src/libyaz0/util.c \
  src/browser/yaz0_browser.c \
  -o lib/browser/libyaz0.js
