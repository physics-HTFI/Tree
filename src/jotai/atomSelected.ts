import { atom } from "jotai";
import { _atomTreeItems } from "./backings/_atomTreeItems";
import { getTreeNode } from "./utils/getTreeNode";
import { fileSystem } from "@/generics/utils/fileSystem";
import { appFileSystem } from "./utils/appFileSystem";
import { svgBase64 } from "./utils/svgBase64";
import { existsSvg } from "@/utils/existsSvg";
import { createAndSaveFolderNode } from "@/components/Editors/FolderEditor/utils/createAndSaveFolderNode";
import { modifierFolderNode } from "@/modifiers/modifierFolderNode";

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

const atomSvgUpdateTrigger = atom(0); // SVGの更新をトリガーするためのatom

const atomSvgBase64 = atom(
  async (get) => {
    get(atomSvgUpdateTrigger);
    const { selectedItemNode } = get(atomTreeNode);
    return await svgBase64.readAsync(selectedItemNode);
  },
  async (get, set, base64str: string) => {
    const { selectedItemNode } = get(atomTreeNode);
    if (!selectedItemNode) return;
    await svgBase64.saveAsync(selectedItemNode, base64str);
    set(atomSvgUpdateTrigger, (prev) => prev + 1);
    await set(atomSetItemNodeAsync, selectedItemNode.entry); // hasSvgフラグの更新
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
    if (
      selectedItemNode.hasSvg &&
      selectedItemNode.entry.title !== undefined &&
      newItemEntry.title !== undefined &&
      selectedItemNode.entry.title !== newItemEntry.title
    ) {
      const overwriting = parentOrSelf.children.some(
        (c) =>
          c.type === "item" &&
          c.entry.title?.toLowerCase() === newItemEntry.title?.toLowerCase() &&
          c.nodeId !== selectedItemNode.nodeId &&
          c.hasSvg,
      );
      if (!overwriting) {
        const oldFileName = selectedItemNode.entry.title + ".svg";
        const newFileName = newItemEntry.title + ".svg";
        const isOk = await fileSystem.renameAsync(
          parentOrSelf.handle,
          oldFileName,
          newFileName,
        );
        if (!isOk) alert("SVGファイルの名前変更に失敗しました");
      }
    }
    // selectedItemNode を更新
    const hasSvg = await existsSvg(parentOrSelf.handle, newItemEntry.title);
    for (const child of parentOrSelf.children) {
      // 同じタイトルでSVGを持つアイテムがある場合、画像のリンク切れを防ぐため、一緒に改名する
      if (
        hasSvg &&
        child.type === "item" &&
        child.entry.title === selectedItemNode.entry.title
      ) {
        child.entry.title = newItemEntry.title;
        child.hasSvg = hasSvg;
      }
    }
    selectedItemNode.entry = {
      ...selectedItemNode.entry,
      ...newItemEntry,
    };
    selectedItemNode.hasSvg = hasSvg;
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

const atomAddNewFolderNodeAsync = atom(
  null,
  async (get, set, folder: NewFolderNode) => {
    const treeItems = get(_atomTreeItems);
    const { selectedFolderNode: parent } = get(atomTreeNode);
    if (!treeItems || !parent?.handle) return;
    // フォルダの作成と保存
    if (!modifierFolderNode.canAdd(folder, parent)) return;
    modifierFolderNode.modify(folder);
    const subFolder = await createAndSaveFolderNode(folder, parent);
    if (!subFolder) return;
    // 親フォルダの更新
    parent.children = [subFolder, ...parent.children];
    await appFileSystem.saveFolderDataAsync(parent);
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
  addNewFolderNodeAsync: atomAddNewFolderNodeAsync,
};
