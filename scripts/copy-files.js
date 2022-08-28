
const fs = require('fs').promises;

const run = async () => {
  const filename = 'yaz0_node.node';
  await fs.copyFile(`build/Release/${filename}`, `src/node/${filename}`);
};

run();
