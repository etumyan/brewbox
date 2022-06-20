import { exec } from 'child_process';
import fs from 'fs-extra';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';

import paths from '../../paths';
import logger from '../../utils/logger';

const argv = yargs(hideBin(process.argv)).argv;
const checkmark = chalk.green('\u2713');
const pointingRight = chalk.green('\u261E');

export default (watch = false) => new Promise<void>(resolve => {
  logger.spinStart('Building Brewbox...');

  const task = exec(`npx ng ${watch ? 'serve' : 'build'}`);

  task.stdout!.on('data', (data: any) => {
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

  if ((argv as any).verbose) {
    task.stdout!.on('data', logger.log);
    task.stderr!.on('data', logger.log);
  }
});
