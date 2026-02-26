import { atom, useAtomValue, useSetAtom } from "jotai";
import { _atomTreeItems } from "./share/backings/_atomTreeItems";
import { appFileSystem } from "./share/utils/appFileSystem";
import { fileSystem } from "../generics/utils/fileSystem";
import { atomFilteredTreeValue } from "./share/atomFIlteredTree";

const atomSetFolderNodeByItemAsync = atom(
  null,
  async (get, set, newItemNode: ItemNode) => {
    const treeItems = get(_atomTreeItems);
    const nodeId = newItemNode.nodeId ?? null;
    const folderNode = getFolderNode(treeItems, nodeId);
    const itemNode = getItemNode(treeItems, nodeId);
    if (!treeItems || !folderNode?.handle || !itemNode) return;
    // SVGファイルの名前を変更（タイトルが変更された場合）
    if (
      itemNode.hasSvg &&
      itemNode.entry.title &&
      newItemNode.entry.title &&
      itemNode.entry.title !== newItemNode.entry.title
    ) {
      const oldFileName = itemNode.entry.title + ".svg";
      const newFileName = newItemNode.entry.title + ".svg";
      await fileSystem.renameAsync(folderNode.handle, oldFileName, newFileName);
    }
    // itemNode を更新
    itemNode.entry = { ...itemNode.entry, ...newItemNode.entry };
    await appFileSystem.saveFolderDataAsync(folderNode);
    set(_atomTreeItems, { ...treeItems });
  },
);

const atomSetFolderNodeAsync = atom(
  null,
  async (get, set, newFolder: FolderNode) => {
    const treeItems = get(_atomTreeItems);
    const folderNode = getFolderNode(treeItems, newFolder.nodeId ?? null);
    if (
      !treeItems ||
      !folderNode?.handle ||
      newFolder.nodeId !== folderNode.nodeId
    )
      return;
    folderNode.path = newFolder.path;
    folderNode.children = newFolder.children;
    await appFileSystem.saveFolderDataAsync(folderNode);
    set(_atomTreeItems, { ...treeItems });
  },
);

export const useFilteredTreeValue = () => useAtomValue(atomFilteredTreeValue);

/** FolderNode の内容を保存し、ツリービューを更新する */
export const useUpdateFolderNode = {
  useUpdateByItemDataAsync: () => useSetAtom(atomSetFolderNodeByItemAsync),
  useUpdateAsync: () => useSetAtom(atomSetFolderNodeAsync),
};

/**  nodeId がフォルダーの場合、そのノードを返す。
 * アイテムの場合、その親フォルダーを返す。
 */
function getFolderNode(
  treeNodes?: FolderNode | null,
  nodeId?: string | null,
): FolderNode | null {
  if (!treeNodes || !nodeId) return null;
  if (treeNodes.nodeId === nodeId) return treeNodes;
  for (const child of treeNodes.children) {
    if (child.nodeId === nodeId)
      return child.type === "folder" ? child : treeNodes;
    if (child.type === "folder") {
      const found = getFolderNode(child, nodeId);
      if (found) return found;
    }
  }
  return null;
}

function getItemNode(
  treeNodes: FolderNode | null,
  nodeId: string | null,
): ItemNode | null {
  if (!treeNodes || !nodeId) return null;
  for (const child of treeNodes.children) {
    if (child.nodeId === nodeId) return child.type === "item" ? child : null;
    if (child.type === "folder") {
      const found = getItemNode(child, nodeId);
      if (found) return found;
    }
  }
  return null;
}
