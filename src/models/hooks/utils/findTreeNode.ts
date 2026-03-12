import type { FolderNode, ItemNode } from "@/types/TreeNode";

/**
 * ツリーノードをIDで再帰的に検索して、見つかったノードを返す
 *
 * {
 *   folder: ノードがフォルダの場合そのノード、それ以外はnull
 *   item: ノードがアイテムの場合そのノード、それ以外はnull
 *   parentOrSelf: ノードがアイテムの場合その親フォルダ、フォルダの場合はノード自身、それ以外はnull
 * }
 */
export function findTreeNode(
  parent?: FolderNode,
  nodeId?: string,
): {
  folderNode?: FolderNode;
  itemNode?: ItemNode;
  parentOrSelf?: FolderNode;
} {
  if (!parent || !nodeId) return {};
  for (const node of parent.children) {
    if (node.nodeId === nodeId)
      return node.type === "folder"
        ? { folderNode: node, parentOrSelf: node }
        : { itemNode: node, parentOrSelf: parent };
    if (node.type === "folder") {
      if (!nodeId.startsWith(node.nodeId)) continue;
      const found = findTreeNode(node, nodeId);
      if (found) return found;
    }
  }
  return {};
}
