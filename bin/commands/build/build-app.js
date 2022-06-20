const { exec } = require('child_process');
const fs = require('fs-extra');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const chalk = require('chalk');

const paths = require('../../paths');
const logger = require('../../utils/logger');

const argv = yargs(hideBin(process.argv)).argv;
const checkmark = chalk.green('\u2713');
const pointingRight = chalk.green('\u261E');

module.exports = watch => new Promise(resolve => {
  logger.spinStart('Building Brewbox...');

  const task = exec(`npx ng ${watch ? 'serve' : 'build'}`);

  task.stdout.on('data', data => {
    const output = data.toString().toLowerCase();
    if (output.includes('build at')) {
      if (!watch) {
        fs.removeSync(`${paths.targetWorkspaceRoot}/brewbox`);
        fs.copySync(`${paths.tempRoot}/dist/brewbox`, `${paths.targetWorkspaceRoot}/brewbox`);
        logger.spinStop(`${checkmark} Brewbox built successfully`);
      } else {
        logger.spinStop([
          `${checkmark} Brewbox built successfully. Watching for changes...\n\r\n\r`,
          `${pointingRight} Visit http://localhost:4200`,
        ].join(''));
      }
      resolve();
    }
  });

  if (argv.verbose) {
    task.stdout.on('data', logger.log);
    task.stderr.on('data', logger.log);
  }
});
