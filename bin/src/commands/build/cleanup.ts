import fs from 'fs-extra';

import paths from '../../paths';

export default () => fs.removeSync(paths.tempRoot);
