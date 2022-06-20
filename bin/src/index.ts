#! /usr/bin/env node

import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

import CommandManager from './utils/command-manager';
import * as commands from './commands';

const argv = yargs(hideBin(process.argv)).argv;

new CommandManager()
  .command(
    'serve',
    'Builds and serves in watch mode',
    () => commands.serve(),
  )
  .command(
    'build',
    'Builds into an output directory',
    () => commands.build(),
  )
  .command(
    'version',
    'Outputs current version',
    () => commands.version(),
  )
  .init(argv);
