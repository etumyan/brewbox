const death = require('death');

const paths = require('../../paths');
const cloneApp = require('./clone-app');
const cloneTargetWorkspace = require('./clone-target-workspace');
const generateTargetWorkspaceDocs = require('./generate-target-workspace-docs');
const buildTargetProject = require('./build-target-project');
const buildApp = require('./build-app');
const cleanup = require('./cleanup');

module.exports = () => {
  (async () => {
    cloneApp();
    await cloneTargetWorkspace();
    process.chdir(paths.tempTargetWorkspaceRoot);
    await generateTargetWorkspaceDocs();
    await buildTargetProject();
    process.chdir(paths.tempRoot);
    await buildApp();
    cleanup();
  })();
};

death(() => {
  cleanup();
  process.exit();
});
