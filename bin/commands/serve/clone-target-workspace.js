const path = require('path');
const fs = require('fs-extra');
const micromatch = require('micromatch');

const paths = require('../../paths');
const copyWatch = require('../../utils/copy-watch');
const modifyJsonFile = require('../../utils/modify-json-file');
const generatePublicApi = require('./generate-target-project-public-api');

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
  modifyJsonFile(ngPackagrConfigPath, data => {
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

module.exports = () => new Promise(resolve => {
  const watcher = copyWatch(paths.targetWorkspaceRoot, paths.tempTargetWorkspaceRoot, _path => micromatch.isMatch(
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
});
