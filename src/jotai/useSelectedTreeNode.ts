import { useAtom, useAtomValue } from "jotai";
import { _atomSelectedTreeNodeId } from "./share/_atomSelectedTreeNodeId";
import { _atomGetTreeItems } from "./share/_atomTreeItems";

const useTreeNode = (nodeId: string | null) => {
  const treeItems = useAtomValue(_atomGetTreeItems);
  return getTreeNode(treeItems, nodeId);
};

export const useSelectedTreeNodeId = () => useAtom(_atomSelectedTreeNodeId);
export const useSelectedTreeNodeIdValue = () =>
  useAtomValue(_atomSelectedTreeNodeId);
export const useFolderNodeValue = (nodeId: string): FolderNode | null => {
  const node = useTreeNode(nodeId);
  return node?.type === "folder" ? node : null;
};
export const useSelectedItemDataValue = (): ItemData | null => {
  const nodeId = useAtomValue(_atomSelectedTreeNodeId);
  const node = useTreeNode(nodeId);
  return node?.type === "item" ? node.data : null;
};

function getTreeNode(
  treeNodes: FolderNode | null,
  itemId: string | null,
): TreeNode | null {
  if (!treeNodes || !itemId) return null;
  for (const item of treeNodes.children) {
    if (item.nodeId === itemId) return item;
    if (item.type === "folder") {
      const found = getTreeNode(item, itemId);
      if (found) return found;
    }
  }
  return null;
}
