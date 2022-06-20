import { EOL } from 'os';
import fs from 'fs';
import path from 'path';
import glob from 'glob';

import leadingDot from '../../utils/leading-dot';
import trimFileExtension from '../../utils/trim-file-extension';

export default (projectRoot: string) => {
  return new Promise<void>(async resolve => {
    const getStoryFiles = (workingDirectory: any) => new Promise(resolve => {
      glob('**/*.stories.ts', {
        cwd: workingDirectory,
        absolute: true,
      }, (_, matches) => {
        resolve(matches);
      });
    });

    const generateImportExpression = (filePath: string, i: number) => {
      return `import * as __BREWBOX_STORIES_EXPORT_${i}__ from '${filePath}';`;
    };

    const generateExportGroup = (filePaths: string[]) => {
      return [
        `export namespace __stories__ {${EOL}`,
        filePaths.map((_, i) => (
          `  export const __BREWBOX_STORIES_${i}__ = __BREWBOX_STORIES_EXPORT_${i}__;`
        )).join(EOL),
        `${EOL}}`,
      ].join('');
    };

    const getRelativePath = (filePath: string) => (
      leadingDot(path.relative(
        `${projectRoot}/src`,
        filePath,
      ))
    );

    const generateImport = () => new Promise(async resolve => {
      const filePaths = await getStoryFiles(projectRoot) as string[];

      let output = `export * from './public-api';${EOL}${EOL}`;

      output += filePaths.map((filePath: string, i: number) => (
        generateImportExpression(trimFileExtension(getRelativePath(filePath)), i)
      )).join(EOL);

      output += EOL + EOL + generateExportGroup(filePaths) + EOL;

      resolve(output);
    });

    fs.writeFileSync(`${projectRoot}/src/brewbox-public-api.ts`, await generateImport());

    resolve();
  });
};
