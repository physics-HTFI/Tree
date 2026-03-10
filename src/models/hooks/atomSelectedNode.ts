import { atom } from "jotai";
import { _atomTree } from "./backings/_atomTree";
import { fileSystem } from "@/generics/utils/fileSystem";
import { appFileSystem } from "./utils/appFileSystem";
import { existsSvg } from "@/models/utils/existsSvg";
import { createNode } from "@/models/hooks/utils/createNode";
import { modifierFolderNode } from "@/models/modifiers/modifierFolderNode";
import { modifierItemNode } from "@/models/modifiers/modifierItemNode";
import { _atomsSelectedNode } from "./backings/_atomSelectedNode";
import { mediaBase64 } from "./utils/mediaBase64";
import { findAudio } from "./utils/findAudio";

//|
//| 選択されたノードのメディアに関するatom
//|

const atomSvgUpdateTrigger = atom(0); // SVGの更新をトリガーするためのatom

const atomSvgBase64 = atom(
  async (get) => {
    get(atomSvgUpdateTrigger);
    const { itemNode } = await get(_atomsSelectedNode.nodeValue);
    return await mediaBase64.readSvgAsync(itemNode);
  },
  async (get, set, base64str: string) => {
    const { itemNode } = await get(_atomsSelectedNode.nodeValue);
    if (!itemNode) return;
    await mediaBase64.saveSvgAsync(itemNode, base64str);
    set(atomSvgUpdateTrigger, (prev) => prev + 1);
    await set(atomSetItemNodeAsync, itemNode.entry); // hasSvgフラグの更新
  },
);

const atomAudioUpdateTrigger = atom(0); // オーディオの更新をトリガーするためのatom

const atomAudioBase64Value = atom(async (get) => {
  get(atomAudioUpdateTrigger);
  const referenceTree = await get(_atomTree.referenceTreeValue);
  const { itemNode } = await get(_atomsSelectedNode.nodeValue);
  const path = itemNode?.entry.path;
  const { handle, name } = findAudio(referenceTree, path);
  return await mediaBase64.readMp3FromFileAsync(handle, name);
});

//|
//| 選択されたノードの更新に関するatom
//|

const atomSetItemNodeAsync = atom(
  null,
  async (get, set, newItemEntry: ItemEntry) => {
    const treeItems = get(_atomTree.dataTree);
    const { parentOrSelf: parent, itemNode } = await get(
      _atomsSelectedNode.nodeValue,
    );
    if (!treeItems || !parent?.handle || !itemNode) return;

    modifierItemNode.modifyItemNode(newItemEntry);
    const canOverwrite = modifierItemNode.canOverwrite(newItemEntry, itemNode);
    if (!canOverwrite) return;

    // SVGファイルの名前を変更（タイトルが変更された場合）
    const titleChanged =
      itemNode.entry.title !== undefined &&
      newItemEntry.title !== undefined &&
      itemNode.entry.title !== newItemEntry.title;
    if (titleChanged && itemNode.hasSvg) {
      const oldFileName = itemNode.entry.title + ".svg";
      const newFileName = newItemEntry.title + ".svg";
      const isOk = await fileSystem.renameAsync(
        parent.handle,
        oldFileName,
        newFileName,
      );
      if (!isOk) alert("SVGファイルの名前変更に失敗しました");
    }

    // オーディオパスの更新をトリガー
    if (newItemEntry.path && itemNode.entry.path !== newItemEntry.path) {
      set(atomAudioUpdateTrigger, (prev) => prev + 1);
    }

    // 同じタイトルのSVGを持つアイテムがある場合、画像のリンク切れを防ぐため、一緒に改名する

    // selectedItemNode を更新
    itemNode.entry = {
      ...itemNode.entry,
      ...newItemEntry,
    };
    itemNode.hasSvg = await existsSvg(parent.handle, newItemEntry.title);
    set(_atomTree.dataTree, { ...treeItems });
    await appFileSystem.saveFolderJsonAsync(parent);
  },
);

const atomSetFolderNodeAsync = atom(
  null,
  async (get, set, newFolder: FolderNode) => {
    const treeItems = get(_atomTree.dataTree);
    const folder = (await get(_atomsSelectedNode.nodeValue)).folderNode;
    if (!treeItems || !folder) return;
    if (newFolder.nodeId !== folder.nodeId) return;

    folder.path = newFolder.path;
    folder.children = newFolder.children;
    modifierFolderNode.modifyNewFolder(folder);
    set(_atomTree.dataTree, { ...treeItems });
    await appFileSystem.saveFolderJsonAsync(folder);
  },
);

const atomAddItemEntryAsync = atom(null, async (get, set, item: ItemEntry) => {
  const parent = (await get(_atomsSelectedNode.nodeValue)).folderNode;
  const newItem = createNode.itemNode(item, parent);
  if (!parent || !newItem) return;
  parent.children = [newItem, ...parent.children];
  await set(atomSetFolderNodeAsync, parent);
});

const atomAddNewFolderNodeAsync = atom(
  null,
  async (get, set, folder: NewFolderNode) => {
    const parent = (await get(_atomsSelectedNode.nodeValue)).folderNode;
    const newFolder = await createNode.folderNode(folder, parent);
    if (!parent || !newFolder) return;
    parent.children = [newFolder, ...parent.children];
    await set(atomSetFolderNodeAsync, parent);
  },
);

//|
//| export
//|

export const atomsSelectedNode = {
  nodeId: _atomsSelectedNode.nodeId,
  unselect: atom(null, (_, set) => set(_atomsSelectedNode.nodeId, undefined)),

  nodeValue: _atomsSelectedNode.nodeValue,

  base64: {
    svg: atomSvgBase64,
    audioValue: atomAudioBase64Value,
  },

  setItemNodeAsync: atomSetItemNodeAsync,
  setFolderNodeAsync: atomSetFolderNodeAsync,
  addItemEntryAsync: atomAddItemEntryAsync,
  addNewFolderNodeAsync: atomAddNewFolderNodeAsync,
};
