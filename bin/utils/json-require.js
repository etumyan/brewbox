const nodeModule = require('module');
const path = require('path');

const localRequire = nodeModule.createRequire(path.resolve(__filename, '../'));

module.exports = filePath => {
  return localRequire(filePath);
};
