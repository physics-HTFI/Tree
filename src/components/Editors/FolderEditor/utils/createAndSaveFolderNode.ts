import { appFileSystem } from "@/jotai/utils/appFileSystem";
import { modifierFolderNode } from "@/modifiers/modifierFolderNode";
import { createId } from "@/utils/createId";

export async function createAndSaveFolderNode(
  folder: NewFolderNode,
  parent: FolderNode,
) {
  if (!modifierFolderNode.canAddFolder(folder, parent)) return null;
  if (!parent.handle) return null;
  try {
    const { title, path } = folder;
    const handle = await parent.handle.getDirectoryHandle(title, {
      create: true,
    });
    const folderNode: FolderNode = {
      type: "folder",
      title,
      path,
      nodeId: createId({ type: "folder", title }, parent.nodeId),
      handle: handle,
      children: [],
    };
    await appFileSystem.saveFolderDataAsync(folderNode);
    return folderNode;
  } catch {
    alert("フォルダの作成に失敗しました"); // フォルダ名に使えない文字が含まれている場合など
    return null;
  }
}
