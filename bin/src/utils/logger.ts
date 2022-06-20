import ora from 'ora';

const log = console.log;

let spinner: any;

export default {
  log,

  spinStart: (text: string) => {
    spinner = ora(text).start();
  },

  spinStop: (text: string) => {
    if (spinner) {
      spinner.stop();
      spinner = undefined;
      log(text);
    }
  },
};
