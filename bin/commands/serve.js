const death = require('death');

const paths = require('../paths');
const cloneApp = require('./build/clone-app');
const cloneTargetWorkspace = require('./build/clone-target-workspace');
const generateTargetWorkspaceDocs = require('./build/generate-target-workspace-docs');
const buildTargetProject = require('./build/build-target-project');
const buildApp = require('./build/build-app');
const cleanup = require('./build/cleanup');

module.exports = () => {
  (async () => {
    cloneApp();
    await cloneTargetWorkspace(true);
    process.chdir(paths.tempTargetWorkspaceRoot);
    await generateTargetWorkspaceDocs(true);
    await buildTargetProject(true);
    process.chdir(paths.tempRoot);
    await buildApp(true);
  })();
};

death(() => {
  cleanup();
  process.exit();
});
