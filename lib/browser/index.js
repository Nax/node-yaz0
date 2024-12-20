import Yaz0Loader from './libyaz0.js';
import mergeChunks from '../util/merge-chunks.js';

let Yaz0 = null;

function getYaz0() {
  if (!Yaz0) {
    Yaz0 = Yaz0Loader();
  }
  return Yaz0;
}

const YAZ0_OK             =  0;
const YAZ0_NEED_AVAIL_IN  =  1;
const YAZ0_NEED_AVAIL_OUT =  2;
const YAZ0_BAD_MAGIC      = -1;
const YAZ0_OUT_OF_MEMORY  = -2;

const OUTPUT_BUFFER_SIZE  =  0x1000;

async function run(compress, data, level) {
  const Yaz0 = await getYaz0();
  const stream = Yaz0._emYaz0Init();
  if (compress) {
    if (level === undefined) {
      level = 0;
    }
    Yaz0._yaz0ModeCompress(stream, data.length, level);
  } else {
    Yaz0._yaz0ModeDecompress(stream);
  }
  const inBuf = Yaz0._malloc(data.length);
  Yaz0.HEAPU8.set(data, inBuf);
  Yaz0._yaz0Input(stream, inBuf, data.length);
  const outBuf = Yaz0._malloc(OUTPUT_BUFFER_SIZE);
  Yaz0._yaz0Output(stream, outBuf, OUTPUT_BUFFER_SIZE);
  const chunks = [];
  let eof = false;
  while (!eof) {
    const ret = Yaz0._yaz0Run(stream);
    switch (ret) {
    case YAZ0_OK:
      eof = true;
      break;
    case YAZ0_NEED_AVAIL_IN:
      throw new Error("Yaz0: Unexpected EOF");
    case YAZ0_NEED_AVAIL_OUT:
      const newChunkSize = Yaz0._yaz0OutputChunkSize(stream);
      const newChunk = Yaz0.HEAPU8.slice(outBuf, outBuf + newChunkSize);
      chunks.push(newChunk);
      Yaz0._yaz0Output(stream, outBuf, OUTPUT_BUFFER_SIZE);
      break;
    }
  }
  const lastChunkSize = Yaz0._yaz0OutputChunkSize(stream);
  if (lastChunkSize > 0) {
    chunks.push(Yaz0.HEAPU8.subarray(outBuf, outBuf + lastChunkSize));
  }
  const merged = mergeChunks(chunks);
  Yaz0._free(inBuf);
  Yaz0._free(outBuf);
  Yaz0._yaz0Destroy(stream);
  return merged;
};

const compress = (data, level) => {
  return run(true, data, level);
};

const decompress = (data) => {
  return run(false, data);
};

export { compress, decompress };
