const fs = require('fs-extra');

const paths = require('../../paths');

module.exports = () => fs.removeSync(paths.tempRoot);
