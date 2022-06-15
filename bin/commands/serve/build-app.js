const { exec } = require('child_process');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const chalk = require('chalk');

const logger = require('../../utils/logger');

const argv = yargs(hideBin(process.argv)).argv;
const checkmark = chalk.green('\u2713');
const pointingRight = chalk.green('\u261E');

module.exports = () => new Promise(resolve => {
  logger.spinStart('Building Brewbox...');

  const task = exec('npx ng serve');

  task.stdout.on('data', data => {
    const output = data.toString().toLowerCase();
    if (output.includes('build at')) {
      logger.spinStop([
        `${checkmark} Brewbox built successfully. Watching for changes...\n\r\n\r`,
        `${pointingRight} Visit http://localhost:4200`,
      ].join(''));
      resolve();
    }
  });

  if (argv.verbose) {
    task.stdout.on('data', logger.log);
    task.stderr.on('data', logger.log);
  }
});
