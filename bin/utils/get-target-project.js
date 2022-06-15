const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const jsonRequire = require('./json-require');

const argv = yargs(hideBin(process.argv)).argv;

const getWorkspaceConfig = workspaceRoot => {
  return jsonRequire(path.join(workspaceRoot, 'angular.json'));
};

const getDefaultProject = workspaceRoot => {
  const { defaultProject } = getWorkspaceConfig(workspaceRoot);
  return defaultProject;
};

const checkIfProjectExists = (workspaceRoot, projectName) => {
  const { projects } = getWorkspaceConfig(workspaceRoot);
  return Object.keys(projects).includes(projectName);
};

module.exports = workspaceRoot => {
  const projectName = argv.project || getDefaultProject(workspaceRoot);

  if (checkIfProjectExists(workspaceRoot, projectName)) {
    return projectName;
  } else {
    throw new Error(`Configuration for specified project "${projectName}" not found.`);
  }
};
