const { Buffer } = require('buffer');
const Yaz0Browser = require('../dist/browser');
const Yaz0Node = require('../dist/node');

test('Yaz0Browser compress and decompress correctly', async () => {
  const data0 = Buffer.from("TESTTESTTESTTESTTESTTESTTESTTESTTESTTEST");
  const data1 = Buffer.concat([data0, data0, data0, data0]);
  const data2 = Buffer.concat([data1, data1, data1, data1]);
  const data3 = Buffer.concat([data2, data2, data2, data2]);
  const compressedData = await Yaz0Browser.compress(data3);
  const decompressedData = await Yaz0Browser.decompress(compressedData);

  expect(compressedData.length).toBeLessThan(data3.length);
  expect(decompressedData.length).toBe(data3.length);
  expect(decompressedData).toEqual(data3);
});

test('Yaz0Node compress and decompress correctly', async () => {
  const data0 = Buffer.from("TESTTESTTESTTESTTESTTESTTESTTESTTESTTEST");
  const data1 = Buffer.concat([data0, data0, data0, data0]);
  const data2 = Buffer.concat([data1, data1, data1, data1]);
  const data3 = Buffer.concat([data2, data2, data2, data2]);
  const compressedData = await Yaz0Node.compress(data3);
  const decompressedData = await Yaz0Node.decompress(compressedData);

  expect(compressedData.length).toBeLessThan(data3.length);
  expect(decompressedData.length).toBe(data3.length);
  expect(decompressedData).toEqual(data3);
});
