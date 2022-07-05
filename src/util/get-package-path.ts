export function getPackagePath(packageName: string) {
  return packageName.replace(/\//g, '__');
}
