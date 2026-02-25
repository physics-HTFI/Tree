import { atom } from "jotai";
import { _atomSelectedTreeNodeId } from "./backings/_atomSelectedTreeNodeId";
import { _atomTreeItems } from "./backings/_atomTreeItems";
import { getTreeNode } from "./utils/getTreeNode";
import { getBase64 } from "./utils/getBase64";
import { _atomSelectedSvg } from "./backings/_atomSelectedSvg";

export const atomSelectedTreeNode = atom((get) => {
  const selectedId = get(_atomSelectedTreeNodeId);
  const treeItems = get(_atomTreeItems);
  return getTreeNode(treeItems, selectedId);
});

export const atomSelectedFolderNode = atom((get) => {
  const node = get(atomSelectedTreeNode);
  return node?.type === "folder" ? node : null;
});

export const atomSelectedItemNode = atom((get) => {
  const node = get(atomSelectedTreeNode);
  return node?.type === "item" ? node : null;
});

const atomSetSelectedSvgById = atom(
  null,
  async (get, set, id: string | null) => {
    const treeItems = get(_atomTreeItems);
    const treeNode = getTreeNode(treeItems, id);
    const itemNode = treeNode?.type === "item" ? treeNode : null;
    const title = itemNode?.entry?.title;
    const svg = await getBase64(
      itemNode?.parent?.handle,
      title ? title + ".svg" : undefined,
    );
    set(_atomSelectedSvg, svg ? "data:image/svg+xml;base64," + svg : null);
  },
);

export const atomSetSelectedSvgByBase64 = atom(
  (get) => get(_atomSelectedSvg),
  async (_, set, base64: string | null) => set(_atomSelectedTreeNodeId, base64),
);

export const atomSelectedTreeNodeId = atom(
  (get) => get(_atomSelectedTreeNodeId),
  async (_, set, id: string | null) => {
    set(_atomSelectedTreeNodeId, id);
    await set(atomSetSelectedSvgById, id);
  },
);
