export default (path: string) => {
  if (path.startsWith('/')) throw new Error('Path is absolute.');

  return path.startsWith('./')
    ? path
    : `./${path}`;
};
