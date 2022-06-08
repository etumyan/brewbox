const ora = require('ora');

const log = console.log;

let spinner;

module.exports = {
  log,

  spinStart: text => {
    spinner = ora(text).start();
  },

  spinStop: text => {
    if (spinner) {
      spinner.stop();
      spinner = undefined;
      log(text);
    }
  },
};
