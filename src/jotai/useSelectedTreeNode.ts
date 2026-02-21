import { useAtom, useAtomValue } from "jotai";
import { _atomSelectedTreeNodeId } from "./share/_atomSelectedTreeNodeId";
import { _atomTreeItems } from "./share/_atomTreeItems";

const useTreeNode = (nodeId: string | null) => {
  const treeItems = useAtomValue(_atomTreeItems);
  return getTreeNode(treeItems, nodeId);
};

export const useSelectedTreeNodeId = () => useAtom(_atomSelectedTreeNodeId);
export const useSelectedTreeNodeIdValue = () =>
  useAtomValue(_atomSelectedTreeNodeId);
export const useFolderNodeValue = (nodeId: string): FolderNode | null => {
  const node = useTreeNode(nodeId);
  return node?.type === "folder" ? node : null;
};
export const useSelectedItemNodeValue = (): ItemNode | null => {
  const nodeId = useAtomValue(_atomSelectedTreeNodeId);
  const node = useTreeNode(nodeId);
  return node?.type === "item" ? node : null;
};

function getTreeNode(
  treeNodes: FolderNode | null,
  nodeId: string | null,
): TreeNode | null {
  if (!treeNodes || !nodeId) return null;
  for (const item of treeNodes.children) {
    if (item.nodeId === nodeId) return item;
    if (item.type === "folder") {
      const found = getTreeNode(item, nodeId);
      if (found) return found;
    }
  }
  return null;
}
