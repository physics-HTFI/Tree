import { fileSystem } from "@/generics/utils/fileSystem";

export async function renameSvgFileAsync(
  oldItem: ItemNode,
  newItem: ItemEntry,
) {
  const handle = oldItem.parent.handle;
  if (!handle) return false;
  if (!oldItem.hasSvg) return true;
  const titleChanged =
    oldItem.entry.title !== undefined &&
    newItem.title !== undefined &&
    oldItem.entry.title !== newItem.title;
  if (!titleChanged) return true;

  const isOk = await fileSystem.renameAsync(
    handle,
    oldItem.entry.title + ".svg",
    newItem.title + ".svg",
  );

  if (!isOk) alert("SVGファイルの名前変更に失敗しました");
  return isOk;
}

export async function moveSvgFileAsync(item: ItemNode, folder: FolderNode) {
  if (!item.hasSvg) return true;
  if (!item.entry.title) return false;
  const title = item.entry.title + ".svg";
  const isOk = await fileSystem.moveAsync(
    item.parent.handle,
    title,
    folder.handle,
    title,
  );
  if (!isOk) alert("SVGファイルの移動に失敗しました");
  return isOk;
}
