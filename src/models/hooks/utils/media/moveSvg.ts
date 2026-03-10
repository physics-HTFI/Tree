import { fileSystem } from "@/generics/utils/fileSystem";

export async function renameSvgFileAsync(
  parentHandle: FileSystemDirectoryHandle,
  oldItem: ItemNode,
  newItem: ItemEntry,
) {
  if (!oldItem.hasSvg) return true;
  const titleChanged =
    oldItem.entry.title !== undefined &&
    newItem.title !== undefined &&
    oldItem.entry.title !== newItem.title;
  if (!titleChanged) return true;

  const oldFileName = oldItem.entry.title + ".svg";
  const newFileName = newItem.title + ".svg";
  const isOk = await fileSystem.renameAsync(
    parentHandle,
    oldFileName,
    newFileName,
  );
  if (!isOk) alert("SVGファイルの名前変更に失敗しました");
  return isOk;
}
