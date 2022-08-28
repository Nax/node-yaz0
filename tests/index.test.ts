import { createYaz0Stream } from "..";
import { Readable } from "stream";

test('compress and decompress correctly', async () => {
  const data = Buffer.from("TESTTESTTESTTESTTESTTESTTESTTESTTESTTEST");
  const dataStream = Readable.from(data);
  const streamComp = createYaz0Stream('compress', { size: data.length });
  const streamDecomp = createYaz0Stream('decompress');

  dataStream.pipe(streamComp).pipe(streamDecomp);

  const chunks: Buffer[] = [];
  for await (const chunk of streamDecomp) {
    chunks.push(chunk);
  }
  const result = Buffer.concat(chunks);
  expect(result).toEqual(data);
});
