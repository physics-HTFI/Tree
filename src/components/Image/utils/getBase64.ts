import { fileSystem } from "../../../utils/fileSystem";

export async function getBase64(
  folder: FileSystemDirectoryHandle,
  fileName: string,
) {
  const exists = await fileSystem.existsAsync(folder, fileName);
  if (!exists) return null;
  const svgText = await fileSystem.readTextAsync(folder, fileName);
  if (!svgText) return null;
  return utf8ToBase64(svgText);
}

function utf8ToBase64(str: string) {
  const bytes = new TextEncoder().encode(str);
  const bin = Array.from(bytes, (b) => String.fromCharCode(b)).join("");
  return btoa(bin);
}
