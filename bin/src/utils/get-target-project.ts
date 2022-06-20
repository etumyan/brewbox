import path from 'path';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

import jsonRequire from './json-require';

const argv = yargs(hideBin(process.argv)).argv;

const getWorkspaceConfig = (workspaceRoot: string) => {
  return jsonRequire(path.join(workspaceRoot, 'angular.json'));
};

const getDefaultProject = (workspaceRoot: string) => {
  const { defaultProject } = getWorkspaceConfig(workspaceRoot);
  return defaultProject;
};

const checkIfProjectExists = (workspaceRoot: string, projectName: string) => {
  const { projects } = getWorkspaceConfig(workspaceRoot);
  return Object.keys(projects).includes(projectName);
};

export default (workspaceRoot: string) => {
  const projectName = (argv as any).project || getDefaultProject(workspaceRoot);

  if (checkIfProjectExists(workspaceRoot, projectName)) {
    return projectName;
  } else {
    throw new Error(`Configuration for specified project "${projectName}" not found.`);
  }
};
