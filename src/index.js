const { Yaz0Stream } = require('./node');

const createYaz0Stream = (mode, opts = {}) => {
  const level = opts.level || 0;
  const size = opts.size;

  switch (mode) {
  case 'compress':
    return new Yaz0Stream(true, size, level);
  case 'decompress':
    return new Yaz0Stream(false, 0, 0);
  default:
    throw new Error(`Unknown mode: ${mode}`);
  }
};

module.exports = { createYaz0Stream };
