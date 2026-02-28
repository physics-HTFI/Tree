export function isUrl(path: string | undefined): boolean {
  if (!path) return false;
  try {
    const url = new URL(path);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
