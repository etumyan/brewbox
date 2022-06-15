const { exec } = require('child_process');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const chalk = require('chalk');

const logger = require('../../utils/logger');
const generateCompodocTsConfig = require('./generate-target-workspace-compodoc-ts-config');

const argv = yargs(hideBin(process.argv)).argv;
const checkmark = chalk.green('\u2713');

module.exports = () => new Promise(async resolve => {
  logger.spinStart('Generating documentation...');

  generateCompodocTsConfig();

  const task = exec([
    'npx @compodoc/compodoc',
    `--tsconfig ./tsconfig.compodoc.json`,
    `--output ../`,
    '--exportFormat json',
    '--watch',
    '--serve',
  ].join(' '));

  task.stdout.on('data', data => {
    const output = data.toString().toLowerCase();
    if (output.includes('documentation generated')) {
      logger.spinStop(`${checkmark} Documentation generated successfully\n\r`);
      resolve();
    }
  });

  if (argv.verbose) {
    task.stdout.on('data', logger.log);
    task.stderr.on('data', logger.log);
  }
});
