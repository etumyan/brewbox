import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';
import glob from 'glob';
import chokidar from 'chokidar';
import debounce from 'lodash.debounce';
import * as compodoc from '@compodoc/compodoc';

import paths from '../../paths';
import logger from '../../utils/logger';

const argv = yargs(hideBin(process.argv)).argv;
const checkmark = chalk.green('\u2713');

function getCompodocOptions() {
  const options: any = {
    output: '../',
    exportFormat: 'json',
  }

  // Any value (even false) set for silent option will disable output log
  if (!(argv as any).verbose) {
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

function watchFiles(files: string[], callback: () => {}) {
  const watcher = chokidar.watch(files, {
    ignoreInitial: true,
    persistent: true,
  });

  const debouncedCallback = debounce(callback, 100);

  ['add', 'change', 'unlink'].forEach(eventName => {
    watcher.on(eventName, debouncedCallback);
  });
}

export default async (watch = false) => {
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
