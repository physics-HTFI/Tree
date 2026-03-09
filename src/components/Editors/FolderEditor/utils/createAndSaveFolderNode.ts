import { appFileSystem } from "@/jotai/utils/appFileSystem";
import { modifierFolderNode } from "@/modifiers/modifierFolderNode";
import { createId } from "@/utils/createId";

export async function createAndSaveFolderNode(
  folder: NewFolderNode,
  parent: FolderNode,
) {
  if (!modifierFolderNode.canAddFolder(folder, parent)) return undefined;
  if (!parent.handle) return undefined;
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
    await appFileSystem.saveFolderJsonAsync(folderNode);
    return folderNode;
  } catch {
    alert("フォルダの作成に失敗しました"); // フォルダ名に使えない文字が含まれている場合など
    return undefined;
  }
}
