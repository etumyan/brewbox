import death from 'death';

import paths from '../../paths';
import cloneApp from './clone-app';
import cloneTargetWorkspace from './clone-target-workspace';
import generateTargetWorkspaceDocs from './generate-target-workspace-docs';
import buildTargetProject from './build-target-project';
import buildApp from './build-app';
import cleanup from './cleanup';

export function build() {
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

  death(() => {
    cleanup();
    process.exit();
  });
};
