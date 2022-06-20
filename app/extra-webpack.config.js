// In order to match components provided in story-files
// with generated documentation we have to keep classnames
module.exports = config => {
  config.optimization.minimizer
    .filter(minimizer => minimizer.constructor.name === 'JavaScriptOptimizerPlugin')
    .forEach(javaScriptOptimizerPlugin => {
      javaScriptOptimizerPlugin.options.keepNames = true;
    });

  return config;
};
