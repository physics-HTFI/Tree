import { atom, useAtom, useAtomValue } from "jotai";
import { _atomTreeItems } from "./share/_atomTreeItems";
import { _atomHiddenTiers } from "./share/_atomHiddenTiers";
import { fileSystem } from "./share/fileSystem";

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
export const useUpdateFolderNode = (nodeId?: string) => {
  const [treeItems, setTreeItems] = useAtom(_atomTreeItems);
  return {
    updateByItemDataAsync: async (newItem: ItemData) => {
      const folderNode = getFolderNode(treeItems, nodeId ?? null);
      const itemNode = getItemNode(treeItems, nodeId ?? null);
      if (!treeItems || !folderNode?.handle || !itemNode) return;
      itemNode.data = { ...itemNode.data, ...newItem };
      await fileSystem.saveFolderDataAsync(folderNode.handle, folderNode);
      setTreeItems({ ...treeItems });
    },
    updateAsync: async (newFolder: FolderNode) => {
      const folderNode = getFolderNode(treeItems, nodeId ?? null);
      if (
        !treeItems ||
        !folderNode?.handle ||
        newFolder.nodeId !== folderNode.nodeId
      )
        return;
      folderNode.path = newFolder.path;
      folderNode.children = newFolder.children;
      await fileSystem.saveFolderDataAsync(folderNode.handle, folderNode);
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
