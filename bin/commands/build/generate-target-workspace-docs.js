const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const chalk = require('chalk');
const glob = require('glob');
const chokidar = require('chokidar');
const debounce = require('lodash.debounce');
const compodoc = require('@compodoc/compodoc');

const paths = require('../../paths');
const logger = require('../../utils/logger');

const argv = yargs(hideBin(process.argv)).argv;
const checkmark = chalk.green('\u2713');

function getCompodocOptions() {
  const options = {
    output: '../',
    exportFormat: 'json',
  }

  // Any value (even false) set for silent option will disable output log
  if (!argv.verbose) {
    options.silent = true;
  }

  return options;
}

function getTargetFiles() {
  return glob.sync('**/*.ts', {
    cwd: paths.tempTargetProjectSource,
    absolute: true,
    dot: true,
    ignore: [
      '**/*.spec.ts',
      '**/*.stories.ts',
    ],
  });
}

function watchFiles(files, callback) {
  const watcher = chokidar.watch(files, {
    ignoreInitial: true,
    persistent: true,
  });

  const debouncedCallback = debounce(callback, 100);

  ['add', 'change', 'unlink'].forEach(eventName => {
    watcher.on(eventName, debouncedCallback);
  });
}

module.exports = async watch => {
  logger.spinStart('Generating documentation...');

  const targetFiles = getTargetFiles();

  const generate = () => {
    // This action is required
    process.chdir(paths.tempTargetWorkspaceRoot);

    const compodocInstance = new compodoc.Application(getCompodocOptions());
    compodocInstance.setFiles(targetFiles);

    return compodocInstance.generate();
  }

  await generate();

  if (watch) {
    watchFiles(targetFiles, generate);
  }

  logger.spinStop(`${checkmark} Documentation generated successfully\n\r`);
};
