import path from 'path';
import fs from 'fs-extra';

import paths from '../../paths';

export default () => {
  fs.copySync(paths.appRoot, paths.tempRoot);

  fs.ensureSymlinkSync(
    path.join(paths.root, 'node_modules'),
    path.join(paths.tempRoot, 'node_modules'),
  );
};
