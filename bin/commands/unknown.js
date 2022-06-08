const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const logger = require('../utils/logger');

const argv = yargs(hideBin(process.argv)).argv;

module.exports = () => {
  return logger.log(`Command "${argv._[0]}" is unknown.`);
};
