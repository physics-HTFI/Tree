import type { TreeNode } from "@/types/TreeNode";

export function isSameTitle(node1?: TreeNode, node2?: TreeNode) {
  if (!node1 || !node2) return false;
  if (node1.type !== node2.type) return false;
  if (node1.type === "folder" && node2.type === "folder") {
    return isSame(node1.title, node2.title);
  } else if (node1.type === "item" && node2.type === "item") {
    return isSame(node1.entry.title, node2.entry.title);
  }
  return false;
}

function isSame(title1?: string, title2?: string) {
  if (!title1 || !title2) return false;
  return title1.trim().toLowerCase() === title2.trim().toLowerCase();
}
