export function isUrl(path: string | undefined): boolean {
  if (!path) return false;
  return path.startsWith("https://");
}
