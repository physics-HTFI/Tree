import { atom } from "jotai";
import { _atomTree } from "./backings/_atomTree";
import { findTreeNode } from "./utils/findTreeNode";
import { fileSystem } from "@/generics/utils/fileSystem";
import { appFileSystem } from "./utils/appFileSystem";
import { mediaBase64 } from "./utils/mediaBase64";
import { existsSvg } from "@/models/utils/existsSvg";
import { createAndSaveFolderNode } from "@/components/Editors/FolderEditor/utils/createAndSaveFolderNode";
import { modifierFolderNode } from "@/models/modifiers/modifierFolderNode";
import { modifierItemNode } from "@/models/modifiers/modifierItemNode";
import { createId } from "@/models/utils/createId";

//|
//| 選択されたノードに関するatom
//|

const atomNodeId = atom<string>();

const atomTreeNode = atom(async (get) => {
  const selectedId = get(atomNodeId);
  const treeItems = await get(_atomTree.fullTreeValue);
  return findTreeNode(treeItems, selectedId);
});

//|
//| SVGファイルの読み書きに関するatom
//|

const atomSvgUpdateTrigger = atom(0); // SVGの更新をトリガーするためのatom

const atomSvgBase64 = atom(
  async (get) => {
    get(atomSvgUpdateTrigger);
    const { selectedItemNode } = await get(atomTreeNode);
    return await mediaBase64.readSvgAsync(selectedItemNode);
  },
  async (get, set, base64str: string) => {
    const { selectedItemNode } = await get(atomTreeNode);
    if (!selectedItemNode) return;
    await mediaBase64.saveSvgAsync(selectedItemNode, base64str);
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
    const treeItems = get(_atomTree.dataTree);
    const { parentOrSelf: parent, selectedItemNode } = await get(atomTreeNode);
    if (!treeItems || !parent?.handle || !selectedItemNode) return;

    modifierItemNode.modifyItemNode(newItemEntry);
    const canOverwrite = modifierItemNode.canOverwrite(
      newItemEntry,
      selectedItemNode,
    );
    if (!canOverwrite) return;

    // SVGファイルの名前を変更（タイトルが変更された場合）
    const titleChanged =
      selectedItemNode.entry.title !== undefined &&
      newItemEntry.title !== undefined &&
      selectedItemNode.entry.title !== newItemEntry.title;
    if (titleChanged && selectedItemNode.hasSvg) {
      const oldFileName = selectedItemNode.entry.title + ".svg";
      const newFileName = newItemEntry.title + ".svg";
      const isOk = await fileSystem.renameAsync(
        parent.handle,
        oldFileName,
        newFileName,
      );
      if (!isOk) alert("SVGファイルの名前変更に失敗しました");
    }

    // 同じタイトルのSVGを持つアイテムがある場合、画像のリンク切れを防ぐため、一緒に改名する

    // selectedItemNode を更新
    selectedItemNode.entry = {
      ...selectedItemNode.entry,
      ...newItemEntry,
    };
    selectedItemNode.hasSvg = await existsSvg(
      parent.handle,
      newItemEntry.title,
    );
    set(_atomTree.dataTree, { ...treeItems });
    await appFileSystem.saveFolderJsonAsync(parent);
  },
);

const atomSetFolderNodeAsync = atom(
  null,
  async (get, set, newFolder: FolderNode) => {
    const treeItems = get(_atomTree.dataTree);
    const { selectedFolderNode: folder } = await get(atomTreeNode);
    if (!treeItems || !folder?.handle) return;
    if (newFolder.nodeId !== folder.nodeId) return;

    modifierFolderNode.modifyNewFolder(newFolder);
    folder.path = newFolder.path;
    folder.children = newFolder.children;
    set(_atomTree.dataTree, { ...treeItems });
    await appFileSystem.saveFolderJsonAsync(folder);
  },
);

const atomAddItemEntryAsync = atom(null, async (get, set, item: ItemEntry) => {
  const { selectedFolderNode: folder } = await get(atomTreeNode);
  if (!folder) return;
  if (!modifierItemNode.isValidItem(item)) return;

  const newItem: ItemNode = {
    type: "item",
    nodeId: createId({ type: "item", title: item.title }, folder.nodeId),
    parent: folder,
    hasSvg: await existsSvg(folder.handle, item.title),
    entry: item,
  };
  folder.children = [newItem, ...folder.children];
  await set(atomSetFolderNodeAsync, folder);
});

const atomAddNewFolderNodeAsync = atom(
  null,
  async (get, set, folder: NewFolderNode) => {
    const treeItems = get(_atomTree.dataTree);
    const { selectedFolderNode: parent } = await get(atomTreeNode);
    if (!treeItems || !parent?.handle) return;
    // フォルダの作成と保存
    if (!modifierFolderNode.canAddFolder(folder, parent)) return;
    modifierFolderNode.modifyNewFolder(folder);
    const subFolder = await createAndSaveFolderNode(folder, parent);
    if (!subFolder) return;
    // 親フォルダの更新
    parent.children = [subFolder, ...parent.children];
    set(_atomTree.dataTree, { ...treeItems });
    await appFileSystem.saveFolderJsonAsync(parent);
  },
);

//|
//| export
//|

export const atomsSelected = {
  nodeId: atomNodeId,
  unselect: atom(null, (_, set) => set(atomNodeId, undefined)),

  nodeValue: atomTreeNode,

  svgBase64: atomSvgBase64,

  setItemNodeAsync: atomSetItemNodeAsync,
  setFolderNodeAsync: atomSetFolderNodeAsync,
  addItemEntryAsync: atomAddItemEntryAsync,
  addNewFolderNodeAsync: atomAddNewFolderNodeAsync,
};
