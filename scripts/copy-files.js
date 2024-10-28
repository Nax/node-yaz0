'use strict';

const fs = require('fs').promises;

const run = async () => {
  const filename = 'yaz0_node.node';
  await fs.mkdir('dist/node', { recursive: true });
  await fs.copyFile(`build/Release/${filename}`, `dist/node/${filename}`);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
