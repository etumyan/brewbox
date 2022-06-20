const { EOL } = require('os');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const leadingDot = require('../../utils/leading-dot');
const trimFileExtension = require('../../utils/trim-file-extension');

module.exports = projectRoot => {
  return new Promise(async resolve => {
    const getStoryFiles = workingDirectory => new Promise(resolve => {
      glob('**/*.stories.ts', {
        cwd: workingDirectory,
        absolute: true,
      }, (_, matches) => {
        resolve(matches);
      });
    });

    const generateImportExpression = (filePath, i) => {
      return `import * as __BREWBOX_STORIES_EXPORT_${i}__ from '${filePath}';`;
    };

    const generateExportGroup = filePaths => {
      return [
        `export namespace __stories__ {${EOL}`,
        filePaths.map((_, i) => (
          `  export const __BREWBOX_STORIES_${i}__ = __BREWBOX_STORIES_EXPORT_${i}__;`
        )).join(EOL),
        `${EOL}}`,
      ].join('');
    };

    const getRelativePath = filePath => (
      leadingDot(path.relative(
        `${projectRoot}/src`,
        filePath,
      ))
    );

    const generateImport = () => new Promise(async resolve => {
      const filePaths = await getStoryFiles(projectRoot);

      let output = `export * from './public-api';${EOL}${EOL}`;

      output += filePaths.map((filePath, i) => (
        generateImportExpression(trimFileExtension(getRelativePath(filePath)), i)
      )).join(EOL);

      output += EOL + EOL + generateExportGroup(filePaths) + EOL;

      resolve(output);
    });

    fs.writeFileSync(`${projectRoot}/src/brewbox-public-api.ts`, await generateImport());

    resolve();
  });
};
