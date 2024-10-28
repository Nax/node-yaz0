const Yaz0Stream = require('./stream');
const mergeChunks = require('../util/merge-chunks');

function run(compress, data, level) {
  return new Promise((resolve, reject) => {
    let transform = null;
    if (compress) {
      if (level === undefined) {
        level = 0;
      }
      transform = new Yaz0Stream(true, data.length, level);
    } else {
      transform = new Yaz0Stream(false, 0, 0);
    }
    const chunks = [];
    transform.on('data', (chunk) => {
      chunks.push(chunk);
    });
    transform.on('error', (err) => {
      reject(err);
    });
    transform.on('end', () => {
      resolve(mergeChunks(chunks));
    });
    transform.end(data);
  });
};

const compress = (data, level) => {
  return run(true, data, level);
};

const decompress = (data) => {
  return run(false, data);
};

module.exports = { compress, decompress };
