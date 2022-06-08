const path = require('path');
const { exec, execSync } = require('child_process');
const fs = require('fs-extra');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const chalk = require('chalk');
const micromatch = require('micromatch');

const logger = require('../../utils/logger');
const jsonRequire = require('../../utils/json-require');
const copyWatch = require('../../utils/copy-watch');
const generatePublicApi = require('./generate-public-api');

const argv = yargs(hideBin(process.argv)).argv;
const checkmark = chalk.green('\u2713');
const pointingRight = chalk.green('\u261E');

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

const getTargetProject = workspaceRoot => {
  const projectName = argv.project || getDefaultProject(workspaceRoot);

  if (checkIfProjectExists(workspaceRoot, projectName)) {
    return projectName;
  } else {
    throw new Error(`Configuration for specified project "${projectName}" not found.`);
  }
};

const updateNgPackagrConfig = () => {
  const filePath = path.join(clonedProjectRoot, 'ng-package.json');
  const rawData = fs.readFileSync(filePath);
  const data = JSON.parse(rawData);
  data.lib.entryFile = 'src/brewbox-public-api.ts';

  fs.writeFileSync(filePath, JSON.stringify(data));
};

const createNodeModulesSymlink = () => {
  fs.ensureSymlinkSync(
    path.join(targetWorkspaceRoot, 'node_modules'),
    path.join(brewboxTemp, 'node_modules'),
  );
}

const createCompodocTsConfig = () => {
  const data = {
    include: [
      `./projects/${targetProject}/**/*.ts`,
    ],
    exclude: [
      `./projects/${targetProject}/**/*.spec.ts`,
      `./projects/${targetProject}/**/*.stories.ts`,
    ],
  };
  fs.writeFileSync(path.join(brewboxTemp, 'tsconfig.compodoc.json'), JSON.stringify(data));
};

const targetWorkspaceRoot = process.cwd();
const targetProject = getTargetProject(targetWorkspaceRoot);
const targetProjectRoot = path.join(targetWorkspaceRoot, 'projects', targetProject);
const targetProjectSource = path.join(targetProjectRoot, 'src');
const brewboxRoot = path.resolve(__dirname, '../../../');
const brewboxTemp = path.join(brewboxRoot, 'tmp');
const clonedProjectRoot = path.join(brewboxTemp, 'projects', targetProject);
const clonedProjectSource = path.join(clonedProjectRoot, 'src');

module.exports = () => {
  const cloneTargetProject = () => new Promise(resolve => {
    const watcher = copyWatch(targetWorkspaceRoot, brewboxTemp, _path => micromatch.isMatch(
      _path,
      '**',
      {
        dot: true,
        ignore: [
          '**/node_modules',
          '**/node_modules/**/*',
          '**/dist',
          '**/dist/**/*',
          '**/.angular',
          '**/.angular/**/*',
          '**/.git',
          '**/.git/**/*',
          '**/.vscode',
          '**/.vscode/**/*',
          '**/.DS_Store',
        ],
      },
    ));
    watcher.on('ready', async () => {
      updateNgPackagrConfig();
      createNodeModulesSymlink();
      await generatePublicApi(clonedProjectRoot);
      resolve();
    });
    watcher.on('change', async () => {
      updateNgPackagrConfig();
      await generatePublicApi(clonedProjectRoot);
    });
  });

  const generateTargetProjectDocs = () => new Promise(async resolve => {
    logger.spinStart('Generating documentation...');

    createCompodocTsConfig();

    const task = exec([
      'npx @compodoc/compodoc',
      `--tsconfig ${brewboxTemp}/tsconfig.compodoc.json`,
      `--output ${brewboxTemp}`,
      '--exportFormat json',
      '--watch',
      '--serve',
    ].join(' '));

    task.stdout.on('data', data => {
      const output = data.toString().toLowerCase();
      if (output.includes('documentation generated')) {
        logger.spinStop(`${checkmark} Documentation generated successfully\n\r`);
        resolve();
      }
    });

    if (argv.verbose) {
      task.stdout.on('data', logger.log);
      task.stderr.on('data', logger.log);
    }
  });

  const buildTargetProject = () => new Promise(resolve => {
    logger.spinStart('Building the library...');

    const task = exec(`npx ng build ${targetProject} --watch`);

    task.stdout.on('data', data => {
      const output = data.toString().toLowerCase();
      if (output.includes('build at')) {
        logger.spinStop(`${checkmark} Library built successfully\n\r`);
        resolve();
      }
    });

    if (argv.verbose) {
      task.stdout.on('data', logger.log);
      task.stderr.on('data', logger.log);
    }
  });

  const installTargetProject = () => new Promise(resolve => {
    logger.spinStart('Installing the library...');

    execSync([
      'npm install',
      `brewbox-target-library@file:${path.relative(brewboxRoot, brewboxTemp)}/dist/${targetProject}`,
      '--no-save',
    ].join(' '));

    logger.spinStop(`${checkmark} Library installed successfully\n\r`);

    resolve();
  });

  const buildBrewbox = () => new Promise(resolve => {
    logger.spinStart('Building Brewbox...');

    const task = exec('npx ng serve');

    task.stdout.on('data', data => {
      const output = data.toString().toLowerCase();
      if (output.includes('build at')) {
        logger.spinStop([
          `${checkmark} Brewbox built successfully. Watching for changes...\n\r\n\r`,
          `${pointingRight} Visit http://localhost:4200`,
        ].join(''));
        resolve();
      }
    });

    if (argv.verbose) {
      task.stdout.on('data', logger.log);
      task.stderr.on('data', logger.log);
    }
  });

  (async () => {
    await cloneTargetProject();
    process.chdir(brewboxTemp);
    await generateTargetProjectDocs();
    await buildTargetProject();
    process.chdir(brewboxRoot);
    await installTargetProject();
    await buildBrewbox();
  })();
};
