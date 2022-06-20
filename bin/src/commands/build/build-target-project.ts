import { exec } from 'child_process';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';

import logger from '../../utils/logger';
import getTargetProject from '../../utils/get-target-project';
import paths from '../../paths';

const argv = yargs(hideBin(process.argv)).argv;
const checkmark = chalk.green('\u2713');
const targetProject = getTargetProject(paths.targetWorkspaceRoot);

export default (watch = false) => new Promise<void>(resolve => {
  logger.spinStart('Building the library...');

  const task = exec(`npx ng build ${targetProject}${watch ? ' --watch' : ''}`);

  task.stdout!.on('data', (data: any) => {
    const output = data.toString().toLowerCase();
    if (output.includes('build at')) {
      logger.spinStop(`${checkmark} Library built successfully\n\r`);
      resolve();
    }
  });

  if ((argv as any).verbose) {
    task.stdout!.on('data', logger.log);
    task.stderr!.on('data', logger.log);
  }
});
