import path from 'path';
import fs from 'fs-extra';
import chokidar from 'chokidar';

export default (
  src: string,
  dest: string,
  filter: (path: string) => boolean,
  onChange?: () => void,
) => {
  const watcher = chokidar.watch(src, {
    persistent: true,
  });

  const getTargetPath = (_path: string) => {
    const relativePath = path.relative(src, _path);
    return `${dest}/${relativePath}`;
  };

  const copy = (_path: string) => {
    if (filter && !filter(_path)) return;
    fs.copySync(_path, getTargetPath(_path));
  };

  const remove = (_path: string) => {
    if (filter && !filter(_path)) return;
    fs.removeSync(getTargetPath(_path));
  };

  const makeDir = (_path: string) => {
    if (filter && !filter(_path)) return;
    fs.ensureDir(getTargetPath(_path));
  };

  watcher
    .on('addDir', makeDir)
    .on('unlinkDir', remove)
    .on('add', copy)
    .on('change', copy)
    .on('unlink', remove);

  watcher.on('raw', () => {
    onChange && onChange();
  });

  return watcher;
};
