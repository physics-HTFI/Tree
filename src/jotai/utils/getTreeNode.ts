/**
 * ツリーノードをIDで再帰的に検索して、見つかったノードを返す
 *
 * {
 *   folder: ノードがフォルダの場合そのノード、それ以外はnull
 *   item: ノードがアイテムの場合そのノード、それ以外はnull
 *   parentOrSelf: ノードがアイテムの場合その親フォルダ、フォルダの場合はノード自身、それ以外はnull
 * }
 */
export function getTreeNode(
  parent: FolderNode | null,
  nodeId: string | null,
): {
  selectedFolderNode?: FolderNode;
  selectedItemNode?: ItemNode;
  parentOrSelf?: FolderNode;
} {
  if (!parent || !nodeId) return {};
  for (const node of parent.children) {
    if (node.nodeId === nodeId)
      return node.type === "folder"
        ? { selectedFolderNode: node, parentOrSelf: node }
        : { selectedItemNode: node, parentOrSelf: parent };
    if (node.type === "folder") {
      if (!nodeId.startsWith(node.nodeId)) continue;
      const found = getTreeNode(node, nodeId);
      if (found) return found;
    }
  }
  return {};
}
