import { atom, useAtom, useAtomValue } from "jotai";
import { _atomTreeItems } from "./share/_atomTreeItems";
import { _atomHiddenTiers } from "./share/_atomHiddenTiers";
import { appFileSystem } from "./share/appFileSystem";
import { fileSystem } from "../generics/utils/fileSystem";

const atomFilteredTreeItems = atom<FolderNode | null>((get) => {
  const tree = structuredClone(get(_atomTreeItems));
  const hiddenTiers = get(_atomHiddenTiers);
  if (!tree) return null;

  const filterTree = (items: FolderNode): FolderNode => {
    const children: TreeNode[] = [];
    for (const item of items.children) {
      if (item.type === "folder") {
        const filteredChild = filterTree(item);
        if (filteredChild.children.length === 0 && hiddenTiers.has(0)) continue;
        children.push(filteredChild);
      } else {
        if (hiddenTiers.has(item.data.tier ?? 0)) continue; // チェックが外れているティアは表示しない
        children.push(item);
      }
    }
    return { ...items, children };
  };

  return filterTree(tree);
});

export const useTreeItemsValue = () => useAtomValue(_atomTreeItems);
export const useFilteredTreeItemsValue = () =>
  useAtomValue(atomFilteredTreeItems);

/** nodeId を持つ（含む） FolderNode の内容を保存し、ツリービューを更新する */
export const useUpdateFolderNode = () => {
  const [treeItems, setTreeItems] = useAtom(_atomTreeItems);
  return {
    updateByItemDataAsync: async (newItemNode: ItemNode) => {
      const nodeId = newItemNode.nodeId ?? null;
      const folderNode = getFolderNode(treeItems, nodeId);
      const itemNode = getItemNode(treeItems, nodeId);
      if (!treeItems || !folderNode?.handle || !itemNode) return;
      // SVGファイルの名前を変更（タイトルが変更された場合）
      if (
        itemNode.hasSvg &&
        itemNode.data.title &&
        newItemNode.data.title &&
        itemNode.data.title !== newItemNode.data.title
      ) {
        const oldFileName = itemNode.data.title + ".svg";
        const newFileName = newItemNode.data.title + ".svg";
        await fileSystem.renameAsync(
          folderNode.handle,
          oldFileName,
          newFileName,
        );
      }
      // itemNode を更新
      itemNode.data = { ...itemNode.data, ...newItemNode.data };
      await appFileSystem.saveFolderDataAsync(folderNode);
      setTreeItems({ ...treeItems });
    },
    updateAsync: async (newFolder: FolderNode) => {
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
      setTreeItems({ ...treeItems });
    },
  };
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
