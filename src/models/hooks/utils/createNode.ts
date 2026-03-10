import { validateFolderNode } from "@/models/validators/validateFolderNode";
import { validateItemNode } from "@/models/validators/validateItemNode";
import { createId } from "@/models/utils/createId";
import { appFileSystem } from "./appFileSystem";

export const createNode = {
  folderNode: createFolderNode,
  itemNode: createItemNode,
};

async function createFolderNode(folder: NewFolderNode, parent?: FolderNode) {
  if (!parent?.handle) return undefined;
  if (!validateFolderNode.canAddFolder(folder, parent)) return undefined;
  try {
    validateFolderNode.modifyNewFolder(folder);
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

function createItemNode(item: ItemEntry, parent?: FolderNode) {
  if (!parent) return undefined;
  if (!validateItemNode.canAddItem(item, parent)) return undefined;
  const newItem: ItemNode = {
    type: "item",
    nodeId: createId({ type: "item", title: item.title }, parent.nodeId),
    parent,
    hasSvg: false,
    entry: item,
  };
  return newItem;
}
