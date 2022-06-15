const fs = require('fs');

module.exports = (filePath, modificator) => {
  if (typeof modificator !== 'function') return;

  const rawData = fs.readFileSync(filePath);
  const modifiedData = modificator(JSON.parse(rawData));

  fs.writeFileSync(filePath, JSON.stringify(modifiedData));
};
