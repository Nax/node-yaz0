import { test } from 'node:test';

import * as Yaz0Browser from '../lib/browser/index.js';
import * as Yaz0Node from '../lib/node/index.js';
import mergeChunks from '../lib/util/merge-chunks.js';

function makeTestBuffer() {
  let buffer = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 5, 4, 5, 4, 5, 5, 5, 5, 255]);
  for (let i = 0; i < 6; ++i) {
    buffer = mergeChunks([buffer, buffer, buffer, buffer]);
  }
  return buffer;
}

function isEqualUint8Array(a, b) {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

test('Yaz0Browser compress and decompress correctly', async (t) => {
  const data = makeTestBuffer();
  const compressedData = await Yaz0Browser.compress(data);
  const decompressedData = await Yaz0Browser.decompress(compressedData);

  t.assert.ok(compressedData.length < data.length);
  t.assert.ok(decompressedData.length === data.length);
  t.assert.ok(isEqualUint8Array(decompressedData, data));
});

test('Yaz0Node compress and decompress correctly', async (t) => {
  const data = makeTestBuffer();
  const compressedData = await Yaz0Node.compress(data);
  const decompressedData = await Yaz0Node.decompress(compressedData);

  t.assert.ok(compressedData.length < data.length);
  t.assert.ok(decompressedData.length === data.length);
  t.assert.ok(isEqualUint8Array(decompressedData, data));
});
