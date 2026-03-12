import { validateFolderNode } from "@/models/validators/validateFolderNode";
import { validateItemNode } from "@/models/validators/validateItemNode";
import { createId } from "@/models/utils/createId";
import { appFileSystem } from "./appFileSystem";
import { media } from "./media";
import type { ItemEntry } from "@/types/FolderJson";
import type {
  FolderNode,
  ItemNode,
  NewFolderNode,
  TreeNode,
} from "@/types/TreeNode";

export const addNode = {
  folderNodeAsync: addFolderNodeAsync,
  itemNode: addItemNode,
  moveItemNodeAsync,
};

async function addFolderNodeAsync(folder: NewFolderNode, parent?: FolderNode) {
  if (!parent?.handle) return;
  if (!validateFolderNode.canAddFolder(folder, parent)) return;
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
      parent,
      nodeId: createId({ type: "folder", title }, parent.nodeId),
      handle: handle,
      children: [],
    };
    parent.children.unshift(folderNode);
    await appFileSystem.saveFolderJsonAsync(folderNode);
  } catch {
    alert("フォルダの作成に失敗しました"); // フォルダ名に使えない文字が含まれている場合など
  }
}

function addItemNode(
  item: ItemEntry,
  parent?: FolderNode,
  hasSvg: boolean = false,
) {
  if (!parent) return;
  if (!validateItemNode.canAddItem(item, parent)) return;
  const newItem: ItemNode = {
    type: "item",
    nodeId: createId({ type: "item", title: item.title }, parent.nodeId),
    parent,
    hasSvg,
    entry: item,
  };
  parent.children.unshift(newItem);
}

async function moveItemNodeAsync(item: TreeNode, to?: TreeNode) {
  if (item.type !== "item" || to?.type !== "folder") return;
  const from = item.parent;
  if (from === to) return;

  from.children = from.children.filter((child) => child !== item);

  const isOk = !item.hasSvg || (await media.moveSvgFileAsync(item, to));
  if (!isOk) {
    from.children.unshift(item);
    return;
  }
  addNode.itemNode(item.entry, to, item.hasSvg);
  await appFileSystem.saveFolderJsonAsync(to);
}
