#! /usr/bin/env node

'use strict';

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const commands = require('./commands');

const argv = yargs(hideBin(process.argv)).argv;

switch (argv._[0]) {
  case 'build':
    commands.build();
    break;
  case 'serve':
  case undefined:
    commands.serve();
    break;
  case 'version':
  case 'v':
    commands.version();
    break;
  default:
    commands.unknown();
    break;
}
