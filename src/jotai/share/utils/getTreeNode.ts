export function getTreeNode(
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
