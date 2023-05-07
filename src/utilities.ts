export function arrayStartsWith(target: string[], name: string[]) {
  for (let i = 0; i < name.length; i++) {
    if (name[i] !== target[i]) {
      return false;
    }
  }
  return true;
}
