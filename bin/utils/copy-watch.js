const path = require('path');
const fs = require('fs-extra');
const chokidar = require('chokidar');

module.exports = (src, dest, filter, onChange, options = {}) => {
  const watcher = chokidar.watch(src, {
    persistent: true,
  });

  const getTargetPath = _path => {
    const relativePath = path.relative(src, _path);
    return `${dest}/${relativePath}`;
  };

  const copy = _path => {
    if (filter && !filter(_path)) return;
    fs.copySync(_path, getTargetPath(_path));
  };

  const remove = _path => {
    if (filter && !filter(_path)) return;
    fs.removeSync(getTargetPath(_path));
  };

  const makeDir = _path => {
    if (filter && !filter(_path)) return;
    fs.mkdirs(getTargetPath(_path));
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
