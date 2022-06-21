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
    [
      ['--project', 'Specifies particular project in Angular workspace directory'],
      ['--verbose', 'Outputs additional information during execution'],
    ],
    () => commands.serve(),
  )
  .command(
    'build',
    'Builds into an output directory',
    [
      ['--project', 'Specifies particular project in Angular workspace directory'],
      ['--verbose', 'Outputs additional information during execution'],
    ],
    () => commands.build(),
  )
  .command(
    'version',
    'Outputs current version',
    [],
    () => commands.version(),
  )
  .init(argv);
