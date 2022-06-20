// Generate Compodoc TypeScript configuration file
// More info: https://compodoc.app

import fs from 'fs';
import path from 'path';

import paths from '../../paths';
import getTargetProject from '../../utils/get-target-project';

export default () => {
  const targetProject = getTargetProject(paths.targetWorkspaceRoot);

  const data = {
    include: [
      `./projects/${targetProject}/**/*.ts`,
    ],
    exclude: [
      `./projects/${targetProject}/**/*.spec.ts`,
      `./projects/${targetProject}/**/*.stories.ts`,
    ],
  };

  fs.writeFileSync(
    path.join(paths.tempTargetWorkspaceRoot, 'tsconfig.compodoc.json'),
    JSON.stringify(data),
  );
};
