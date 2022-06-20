#! /usr/bin/env node

'use strict';

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const CommandManager = require('./utils/command-manager');
const commands = require('./commands');

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
