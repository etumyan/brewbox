import nodeModule from 'module';
import path from 'path';

const localRequire = nodeModule.createRequire(path.resolve(__filename, '../'));

export default (filePath: string) => {
  return localRequire(filePath);
};
