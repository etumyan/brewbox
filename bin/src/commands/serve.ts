import death from 'death';

import paths from '../paths';
import cloneApp from './build/clone-app';
import cloneTargetWorkspace from './build/clone-target-workspace';
import generateTargetWorkspaceDocs from './build/generate-target-workspace-docs';
import buildTargetProject from './build/build-target-project';
import buildApp from './build/build-app';
import cleanup from './build/cleanup';

export function serve() {
  (async () => {
    cloneApp();
    await cloneTargetWorkspace(true);
    process.chdir(paths.tempTargetWorkspaceRoot);
    await generateTargetWorkspaceDocs(true);
    await buildTargetProject(true);
    process.chdir(paths.tempRoot);
    await buildApp(true);
  })();

  death(() => {
    cleanup();
    process.exit();
  });
};
