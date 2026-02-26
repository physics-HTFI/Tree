import { atom } from "jotai";
import { _atomTreeItems } from "./backings/_atomTreeItems";
import { getTreeNode } from "./utils/getTreeNode";
import { base64 } from "@/generics/utils/base64";
import { fileSystem } from "@/generics/utils/fileSystem";
import { appFileSystem } from "./utils/appFileSystem";

//|
//| 選択されたノードに関するatom
//|

const atomNodeId = atom<string | null>(null);

const atomTreeNode = atom((get) => {
  const selectedId = get(atomNodeId);
  const treeItems = get(_atomTreeItems);
  return getTreeNode(treeItems, selectedId);
});

//|
//| SVGファイルの読み書きに関するatom
//|

const HEADER = "data:image/svg+xml;base64,";
const atomSvgUpdateTrigger = atom(0); // SVGの更新をトリガーするためのatom

const atomSvgBase64 = atom(
  async (get) => {
    get(atomSvgUpdateTrigger);
    const { selectedItemNode } = get(atomTreeNode);
    const handle = selectedItemNode?.parent?.handle;
    const title = selectedItemNode?.entry?.title;
    if (!handle || title === undefined) return null;
    const svg = await base64.readBase64Async(handle, title + ".svg");
    return HEADER + svg;
  },
  async (get, set, base64str: string) => {
    const { selectedItemNode } = get(atomTreeNode);
    const handle = selectedItemNode?.parent?.handle;
    const title = selectedItemNode?.entry?.title;
    if (!handle || title === undefined) {
      alert("SVGファイルを保存できません");
      return;
    }
    await base64.saveBase64Async(
      handle,
      title + ".svg",
      base64str.replace(HEADER, ""),
    );
    set(atomSvgUpdateTrigger, (prev) => prev + 1);
  },
);

//|
//| 選択されたノードの更新に関するatom
//|

const atomSetItemNodeAsync = atom(
  null,
  async (get, set, newItemEntry: ItemEntry) => {
    const treeItems = get(_atomTreeItems);
    const { parentOrSelf, selectedItemNode } = get(atomTreeNode);
    if (!treeItems || !parentOrSelf?.handle || !selectedItemNode) return;
    // SVGファイルの名前を変更（タイトルが変更された場合）
    const duplicated = parentOrSelf.children.some(
      (c) =>
        c.type === "item" &&
        c.entry.title?.toLowerCase() === newItemEntry.title?.toLowerCase() &&
        c.nodeId !== selectedItemNode.nodeId &&
        c.hasSvg,
    );
    if (
      selectedItemNode.hasSvg &&
      selectedItemNode.entry.title !== undefined &&
      newItemEntry.title !== undefined &&
      selectedItemNode.entry.title !== newItemEntry.title &&
      !duplicated
    ) {
      const oldFileName = selectedItemNode.entry.title + ".svg";
      const newFileName = newItemEntry.title + ".svg";
      await fileSystem.renameAsync(
        parentOrSelf.handle,
        oldFileName,
        newFileName,
      );
    }
    // selectedItemNode を更新
    selectedItemNode.entry = {
      ...selectedItemNode.entry,
      ...newItemEntry,
    };
    selectedItemNode.hasSvg = await fileSystem.existsAsync(
      parentOrSelf.handle,
      newItemEntry.title + ".svg",
    );
    await appFileSystem.saveFolderDataAsync(parentOrSelf);
    set(_atomTreeItems, { ...treeItems });
  },
);

const atomSetFolderNodeAsync = atom(
  null,
  async (get, set, newFolder: FolderNode) => {
    const treeItems = get(_atomTreeItems);
    const { parentOrSelf } = get(atomTreeNode);
    if (
      !treeItems ||
      !parentOrSelf?.handle ||
      newFolder.nodeId !== parentOrSelf.nodeId
    )
      return;
    parentOrSelf.path = newFolder.path;
    parentOrSelf.children = newFolder.children;
    await appFileSystem.saveFolderDataAsync(parentOrSelf);
    set(_atomTreeItems, { ...treeItems });
  },
);

//|
//| export
//|

export const atomsSelected = {
  nodeId: atomNodeId,
  unselectAsync: atom(null, (_, set) => set(atomNodeId, null)),

  nodeValue: atomTreeNode,

  svgBase64: atomSvgBase64,

  setItemNodeAsync: atomSetItemNodeAsync,
  setFolderNodeAsync: atomSetFolderNodeAsync,
};
