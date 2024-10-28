const Yaz0Browser = require('../dist/browser');
const Yaz0Node = require('../dist/node');
const mergeChunks = require('../dist/util/merge-chunks');

function makeTestBuffer() {
  let buffer = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 5, 4, 5, 4, 5, 5, 5, 5, 255]);
  for (let i = 0; i < 4; ++i) {
    buffer = mergeChunks([buffer, buffer, buffer, buffer]);
  }
  return buffer;
}

test('Yaz0Browser compress and decompress correctly', async () => {
  const data = makeTestBuffer();
  const compressedData = await Yaz0Browser.compress(data);
  const decompressedData = await Yaz0Browser.decompress(compressedData);

  expect(compressedData.length).toBeLessThan(data.length);
  expect(decompressedData.length).toBe(data.length);
  expect(decompressedData).toEqual(data);
});

test('Yaz0Node compress and decompress correctly', async () => {
  const data = makeTestBuffer();
  const compressedData = await Yaz0Node.compress(data);
  const decompressedData = await Yaz0Node.decompress(compressedData);

  expect(compressedData.length).toBeLessThan(data.length);
  expect(decompressedData.length).toBe(data.length);
  expect(decompressedData).toEqual(data);
});
