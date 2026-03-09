import { atom } from "jotai";
import { _atomTree } from "./backings/_atomTree";
import { fileSystem } from "@/generics/utils/fileSystem";
import { appFileSystem } from "./utils/appFileSystem";
import { existsSvg } from "@/models/utils/existsSvg";
import { createAndSaveFolderNode } from "@/components/Editors/FolderEditor/utils/createAndSaveFolderNode";
import { modifierFolderNode } from "@/models/modifiers/modifierFolderNode";
import { modifierItemNode } from "@/models/modifiers/modifierItemNode";
import { createId } from "@/models/utils/createId";
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
    const { selectedItemNode } = await get(_atomsSelectedNode.nodeValue);
    return await mediaBase64.readSvgAsync(selectedItemNode);
  },
  async (get, set, base64str: string) => {
    const { selectedItemNode } = await get(_atomsSelectedNode.nodeValue);
    if (!selectedItemNode) return;
    await mediaBase64.saveSvgAsync(selectedItemNode, base64str);
    set(atomSvgUpdateTrigger, (prev) => prev + 1);
    await set(atomSetItemNodeAsync, selectedItemNode.entry); // hasSvgフラグの更新
  },
);

const atomAudioUpdateTrigger = atom(0); // オーディオの更新をトリガーするためのatom

const atomAudioBase64Value = atom(async (get) => {
  get(atomAudioUpdateTrigger);
  const referenceTree = await get(_atomTree.referenceTreeValue);
  const { selectedItemNode } = await get(_atomsSelectedNode.nodeValue);
  const path = selectedItemNode?.entry.path;
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
    const { parentOrSelf: parent, selectedItemNode } = await get(
      _atomsSelectedNode.nodeValue,
    );
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

    // オーディオパスの更新をトリガー
    if (
      newItemEntry.path &&
      selectedItemNode.entry.path !== newItemEntry.path
    ) {
      set(atomAudioUpdateTrigger, (prev) => prev + 1);
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
    const { selectedFolderNode: folder } = await get(
      _atomsSelectedNode.nodeValue,
    );
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
  const { selectedFolderNode: folder } = await get(
    _atomsSelectedNode.nodeValue,
  );
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
    const { selectedFolderNode: parent } = await get(
      _atomsSelectedNode.nodeValue,
    );
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

export const atomsSelectedNode = {
  nodeId: _atomsSelectedNode.nodeId,
  unselect: atom(null, (_, set) => set(_atomsSelectedNode.nodeId, undefined)),

  nodeValue: _atomsSelectedNode.nodeValue,

  svgBase64: atomSvgBase64,
  audioBase64Value: atomAudioBase64Value,

  setItemNodeAsync: atomSetItemNodeAsync,
  setFolderNodeAsync: atomSetFolderNodeAsync,
  addItemEntryAsync: atomAddItemEntryAsync,
  addNewFolderNodeAsync: atomAddNewFolderNodeAsync,
};
