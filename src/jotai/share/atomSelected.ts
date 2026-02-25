import { atom } from "jotai";
import { _atomSelectedTreeNodeId } from "./backings/_atomSelectedTreeNodeId";
import { _atomTreeItems } from "./backings/_atomTreeItems";
import { getTreeNode } from "./utils/getTreeNode";
import { getBase64 } from "./utils/getBase64";

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

export const atomSelectedSvg = atom<string | null>(null);

export const atomSelectedTreeNodeId = atom(
  (get) => get(_atomSelectedTreeNodeId),
  async (get, set, id: string | null) => {
    set(_atomSelectedTreeNodeId, id);

    // アイテムが選択された場合、SVGも更新する
    const itemNode = get(atomSelectedItemNode);
    const title = itemNode?.entry?.title;
    const svg = await getBase64(
      itemNode?.parent?.handle,
      title ? title + ".svg" : undefined,
    );
    set(atomSelectedSvg, svg ? "data:image/svg+xml;base64," + svg : null);
  },
);
