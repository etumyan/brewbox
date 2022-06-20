import path from 'path';
import fs from 'fs-extra';
import micromatch from 'micromatch';

import paths from '../../paths';
import copyWatch from '../../utils/copy-watch';
import modifyJsonFile from '../../utils/modify-json-file';
import generatePublicApi from './generate-target-project-public-api';

const ignorePatterns = [
  '**/.git',
  '**/.git/**/*',
  '**/node_modules',
  '**/node_modules/**/*',
  '**/dist',
  '**/dist/**/*',
  '**/.angular',
  '**/.angular/**/*',
  '**/.vscode',
  '**/.vscode/**/*',
  '**/.DS_Store',
];

const modifyNgPackagrConfig = () => {
  const ngPackagrConfigPath = path.join(paths.tempTargetProjectRoot, 'ng-package.json');
  modifyJsonFile(ngPackagrConfigPath, (data: any) => {
    data.lib.entryFile = 'src/brewbox-public-api.ts';
    return data;
  });
};

const linkNodeModules = () => {
  fs.ensureSymlinkSync(
    path.join(paths.targetWorkspaceRoot, 'node_modules'),
    path.join(paths.tempTargetWorkspaceRoot, 'node_modules'),
  );
};

export default (watch = false) => new Promise<void>(async resolve => {
  if (watch) {
    const watcher = copyWatch(paths.targetWorkspaceRoot, paths.tempTargetWorkspaceRoot, (_path: string) => micromatch.isMatch(
      _path,
      '**',
      {
        dot: true,
        ignore: ignorePatterns,
      },
    ));
    watcher.on('ready', async () => {
      modifyNgPackagrConfig();
      linkNodeModules();
      await generatePublicApi(paths.tempTargetProjectRoot);
      resolve();
    });
    watcher.on('change', async () => {
      modifyNgPackagrConfig();
      await generatePublicApi(paths.tempTargetProjectRoot);
    });
  } else {
    fs.copySync(paths.targetWorkspaceRoot, paths.tempTargetWorkspaceRoot, {
      filter: (_path: string) => micromatch.isMatch(
        _path,
        '**',
        {
          dot: true,
          ignore: ignorePatterns,
        },
      ),
    });
    modifyNgPackagrConfig();
    linkNodeModules();
    await generatePublicApi(paths.tempTargetProjectRoot);
    resolve();
  }
});
