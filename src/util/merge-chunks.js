'use strict';

module.exports = (buffers) => {
  const newBufSize = buffers.reduce((acc, buf) => acc + buf.length, 0);
  const newBuf = new Uint8Array(newBufSize);
  let offset = 0;
  for (const buf of buffers) {
    newBuf.set(buf, offset);
    offset += buf.length;
  }
  return newBuf;
};
