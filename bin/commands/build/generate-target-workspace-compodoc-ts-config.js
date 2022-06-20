// Generate Compodoc TypeScript configuration file
// More info: https://compodoc.app

const fs = require('fs');
const path = require('path');

const paths = require('../../paths');
const getTargetProject = require('../../utils/get-target-project');

module.exports = () => {
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
