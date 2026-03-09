import { fileSystem } from "@/generics/utils/fileSystem";

export async function existsSvg(
  handle?: FileSystemDirectoryHandle,
  title?: string,
) {
  if (!handle || title === undefined) return false;
  return await fileSystem.existsAsync(handle, title + ".svg");
}
