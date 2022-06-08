export function parsePath(path: string) {
  const segments = path
    .replace(/^\//, '')
    .replace(/\/$/, '')
    .split('/');

  return {
    group: segments.slice(0, -2),
    component: segments[segments.length - 2],
    story: segments[segments.length - 1],
  };
}
