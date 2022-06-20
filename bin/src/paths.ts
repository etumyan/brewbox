import os from 'os';
import fs from 'fs';
import path from 'path';

import getTargetProject from './utils/get-target-project';

const root = path.resolve(__dirname, '../../');
const binRoot = path.join(root, 'bin');
const appRoot = path.join(root, 'app');
const targetWorkspaceRoot = process.cwd();
const targetProjectName = getTargetProject(targetWorkspaceRoot);
const targetProjectRoot = path.join(targetWorkspaceRoot, 'projects', targetProjectName);
const tempRoot = fs.mkdtempSync(os.tmpdir());
const tempTargetWorkspaceRoot = path.join(tempRoot, 'target');
const tempTargetProjectRoot = path.join(tempTargetWorkspaceRoot, 'projects', targetProjectName);
const tempTargetProjectSource = path.join(tempTargetProjectRoot, 'src');

export default {
  root,
  binRoot,
  appRoot,
  targetWorkspaceRoot,
  targetProjectRoot,
  tempRoot,
  tempTargetWorkspaceRoot,
  tempTargetProjectRoot,
  tempTargetProjectSource,
};
