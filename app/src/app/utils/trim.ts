export function trim(target: string, sequence?: string) {
  if (sequence === undefined) return target.trim();

  if (target.startsWith(sequence)) {
    target = target.slice(sequence.length, target.length);
  }

  if (target.endsWith(sequence)) {
    target = target.slice(0, target.length - sequence.length);
  }

  return target;
}
