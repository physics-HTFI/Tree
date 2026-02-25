import { atom } from "jotai";
import { _atomSelectedTreeNodeId } from "./backings/_atomSelectedTreeNodeId";
import { _atomTreeItems } from "./backings/_atomTreeItems";
import { getTreeNode } from "./utils/getTreeNode";
import { base64 } from "../../generics/utils/base64";
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

const HEADER = "data:image/svg+xml;base64,";

const atomSetSelectedSvgById = atom(
  null,
  async (get, set, id: string | null) => {
    const treeItems = get(_atomTreeItems);
    const treeNode = getTreeNode(treeItems, id);
    const itemNode = treeNode?.type === "item" ? treeNode : null;
    const title = itemNode?.entry?.title;
    const svg = await base64.readBase64Async(
      itemNode?.parent?.handle,
      title ? title + ".svg" : undefined,
    );
    set(_atomSelectedSvg, svg ? HEADER + svg : null);
  },
);

export const atomSetSelectedSvgByBase64 = atom(
  (get) => get(_atomSelectedSvg),
  async (get, set, base64str: string | null) => {
    const node = get(atomSelectedItemNode);
    await base64.saveBase64Async(
      node?.parent?.handle,
      node?.entry?.title + ".svg",
      base64str ? base64str.replace(HEADER, "") : "",
    );
    // 保存されているか確認のためファイルから読み直す
    const id = get(_atomSelectedTreeNodeId);
    await set(atomSetSelectedSvgById, id);
  },
);

export const atomSelectedTreeNodeId = atom(
  (get) => get(_atomSelectedTreeNodeId),
  async (_, set, id: string | null) => {
    set(_atomSelectedTreeNodeId, id);
    await set(atomSetSelectedSvgById, id);
  },
);
