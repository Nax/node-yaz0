#!/bin/sh

mkdir -p dist/browser

emcc -Ilibyaz0/include -O3 --closure 1 \
  --memory-init-file 0 \
  -sWASM=0 \
  -sALLOW_MEMORY_GROWTH=1 \
  -sNO_FILESYSTEM=1 \
  -sENVIRONMENT='web' \
  -sEXPORTED_FUNCTIONS=_malloc,_free,_realloc,_emYaz0Init,_yaz0Destroy,_yaz0ModeDecompress,_yaz0ModeCompress,_yaz0Run,_yaz0Input,_yaz0Output,_yaz0OutputChunkSize,_yaz0DecompressedSize \
  libyaz0/src/libyaz0/compress.c \
  libyaz0/src/libyaz0/decompress.c \
  libyaz0/src/libyaz0/libyaz0.c \
  libyaz0/src/libyaz0/util.c \
  src/browser/yaz0_browser.c \
  -o dist/browser/libyaz0.js
cp -r src/browser/*.js dist/browser/
cp -r src/node/*.js dist/node/
