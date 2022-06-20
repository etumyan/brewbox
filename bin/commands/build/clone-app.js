const path = require('path');
const fs = require('fs-extra');

const paths = require('../../paths');

module.exports = () => {
  fs.copySync(paths.appRoot, paths.tempRoot);

  fs.ensureSymlinkSync(
    path.join(paths.root, 'node_modules'),
    path.join(paths.tempRoot, 'node_modules'),
  );
};
