import { atom } from "jotai";
import { findTreeNode } from "../utils/findTreeNode";
import { _atomTree } from "./_atomTree";

const atomSelectedNodeId = atom<string>();

const atomSelectedTreeNode = atom(async (get) => {
  const selectedId = get(atomSelectedNodeId);
  const treeItems = await get(_atomTree.fullTreeValue);
  return findTreeNode(treeItems, selectedId);
});

export const _atomsSelectedNode = {
  nodeId: atomSelectedNodeId,
  nodeValue: atomSelectedTreeNode,
};
