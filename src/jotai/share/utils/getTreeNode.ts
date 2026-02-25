export function getTreeNode(
  treeNodes: FolderNode | null,
  nodeId: string | null,
): TreeNode | null {
  if (!treeNodes || !nodeId) return null;
  for (const node of treeNodes.children) {
    if (node.nodeId === nodeId) return node;
    if (node.type === "folder") {
      if (!nodeId.startsWith(node.nodeId)) continue;
      const found = getTreeNode(node, nodeId);
      if (found) return found;
    }
  }
  return null;
}
