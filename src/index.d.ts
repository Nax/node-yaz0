import type { Buffer } from 'buffer';

export function compress(data:Buffer, level?:number): Promise<Buffer>;
export function decompress(data:Buffer): Promise<Buffer>;
