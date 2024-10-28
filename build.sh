#!/bin/sh

mkdir -p dist/browser
mkdir -p dist/util

emcc -Ilibyaz0/include -Oz --closure 2 \
  -sENVIRONMENT=web \
  -sWASM=0 \
  -sMODULARIZE=1 \
  -sMALLOC=emmalloc \
  -sFILESYSTEM=0 \
  -sWASM_ASYNC_COMPILATION=0 \
  -sEXPORTED_FUNCTIONS=_malloc,_free,_realloc,_emYaz0Init,_yaz0Destroy,_yaz0ModeDecompress,_yaz0ModeCompress,_yaz0Run,_yaz0Input,_yaz0Output,_yaz0OutputChunkSize,_yaz0DecompressedSize \
  libyaz0/src/libyaz0/compress.c \
  libyaz0/src/libyaz0/decompress.c \
  libyaz0/src/libyaz0/libyaz0.c \
  libyaz0/src/libyaz0/util.c \
  src/browser/yaz0_browser.c \
  -o src/browser/libyaz0.js

./node_modules/.bin/rollup --format cjs --config ./rollup.config.js ./src/browser/index.js --file dist/browser/index.js
cp -r src/node/*.js dist/node/
cp -r src/util/*.js dist/util/
