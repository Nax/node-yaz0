import type { Transform } from 'stream';

declare type Yaz0Options = {
  size: number;
  level?: number;
};

export function createYaz0Stream(mode: 'compress', opts: Yaz0Options): Transform;
export function createYaz0Stream(mode: 'decompress'): Transform;
