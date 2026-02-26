import { atom } from "jotai";
import { _atomTreeItems } from "./backings/_atomTreeItems";
import { getTreeNode } from "./utils/getTreeNode";
import { base64 } from "../generics/utils/base64";
import { fileSystem } from "../generics/utils/fileSystem";
import { appFileSystem } from "./utils/appFileSystem";

export const _atomSelectedTreeNodeId = atom<string | null>(null);

export const atomSelectedTreeNode = atom((get) => {
  const selectedId = get(_atomSelectedTreeNodeId);
  const treeItems = get(_atomTreeItems);
  return getTreeNode(treeItems, selectedId);
});

export const atomFolderNodeValue = atom((get) => {
  const node = get(atomSelectedTreeNode);
  return node?.type === "folder" ? node : null;
});

export const atomItemNodeValue = atom((get) => {
  const node = get(atomSelectedTreeNode);
  return node?.type === "item" ? node : null;
});

const HEADER = "data:image/svg+xml;base64,";
export const _atomSelectedSvg = atom<string | null>(null);

const atomSetSelectedSvgById = atom(
  null,
  async (get, set, id: string | null) => {
    const treeItems = get(_atomTreeItems);
    const treeNode = getTreeNode(treeItems, id);
    const itemNode = treeNode?.type === "item" ? treeNode : null;
    const title = itemNode?.entry?.title;
    const svg = await base64.readBase64Async(
      itemNode?.parent?.handle,
      title ? title + ".svg" : undefined,
    );
    set(_atomSelectedSvg, svg ? HEADER + svg : null);
  },
);

export const atomSvgBase64 = atom(
  (get) => get(_atomSelectedSvg),
  async (get, set, base64str: string | null) => {
    const node = get(atomItemNodeValue);
    await base64.saveBase64Async(
      node?.parent?.handle,
      node?.entry?.title + ".svg",
      base64str ? base64str.replace(HEADER, "") : "",
    );
    // 保存されているか確認のためファイルから読み直す
    const id = get(_atomSelectedTreeNodeId);
    await set(atomSetSelectedSvgById, id);
  },
);

export const atomTreeNodeId = atom(
  (get) => get(_atomSelectedTreeNodeId),
  async (_, set, id: string | null) => {
    set(_atomSelectedTreeNodeId, id);
    await set(atomSetSelectedSvgById, id);
  },
);

const atomUnselectAsync = atom(null, (_, set) => set(atomTreeNodeId, null));

export const atomSetFolderNodeByItemAsync = atom(
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

export const atomSetFolderNodeAsync = atom(
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

export const atomsSelected = {
  treeNodeId: atomTreeNodeId,
  unselectAsync: atomUnselectAsync,
  folderNodeValue: atomFolderNodeValue,
  itemNodeValue: atomItemNodeValue,
  svgBase64: atomSvgBase64,
  setItemNodeAsync: atomSetFolderNodeByItemAsync,
  setFolderNodeAsync: atomSetFolderNodeAsync,
};
