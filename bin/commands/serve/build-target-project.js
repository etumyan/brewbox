const { exec } = require('child_process');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const chalk = require('chalk');

const logger = require('../../utils/logger');
const getTargetProject = require('../../utils/get-target-project');
const paths = require('../../paths');

const argv = yargs(hideBin(process.argv)).argv;
const checkmark = chalk.green('\u2713');
const targetProject = getTargetProject(paths.targetWorkspaceRoot);

module.exports = () => new Promise(resolve => {
  logger.spinStart('Building the library...');

  const task = exec(`npx ng build ${targetProject} --watch`);

  task.stdout.on('data', data => {
    const output = data.toString().toLowerCase();
    if (output.includes('build at')) {
      logger.spinStop(`${checkmark} Library built successfully\n\r`);
      resolve();
    }
  });

  if (argv.verbose) {
    task.stdout.on('data', logger.log);
    task.stderr.on('data', logger.log);
  }
});
