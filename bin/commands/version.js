const jsonRequire = require('../utils/json-require');
const logger = require('../utils/logger');

module.exports = () => {
  const { version } = jsonRequire('../package.json');
  logger.log(version);
};
