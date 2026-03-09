import { atom } from "jotai";
import { _atomTree } from "./backings/_atomTree";
import { getTreeNode } from "./utils/getTreeNode";
import { fileSystem } from "@/generics/utils/fileSystem";
import { appFileSystem } from "./utils/appFileSystem";
import { itemBase64 } from "./utils/itemBase64";
import { existsSvg } from "@/utils/existsSvg";
import { createAndSaveFolderNode } from "@/components/Editors/FolderEditor/utils/createAndSaveFolderNode";
import { modifierFolderNode } from "@/modifiers/modifierFolderNode";
import { modifierItemNode } from "@/modifiers/modifierItemNode";
import { createId } from "@/utils/createId";
import { atomReferenceJsonValue } from "./atomReferenceJson";
import { _atomReferenceJson } from "./backings/_atomReferenceJson";
import { _atomFolders } from "./backings/_atomFolders";

//|
//| 選択されたノードに関するatom
//|

const atomNodeId = atom<string>();

const atomTreeNode = atom((get) => {
  const selectedId = get(atomNodeId);
  const treeItems = get(_atomTree.fullTree);
  return getTreeNode(treeItems, selectedId);
});

//|
//| 選択された参照ノードの更新に関するatom
//|

const atomSetReferencePathAsync = atom(
  null,
  async (get, set, path: string, type: "add" | "remove") => {
    const data = get(atomReferenceJsonValue);
    const folder = get(_atomFolders)?.data;
    if (!folder) return;
    if (type === "add") {
      data.highlighted_paths.push(path);
    } else if (type === "remove") {
      data.highlighted_paths = data.highlighted_paths.filter((p) => p !== path);
    }
    set(_atomReferenceJson, { ...data });
    await appFileSystem.saveReferenceDataAsync(folder, data);
  },
);

//|
//| SVGファイルの読み書きに関するatom
//|

const atomSvgUpdateTrigger = atom(0); // SVGの更新をトリガーするためのatom

const atomSvgBase64 = atom(
  async (get) => {
    get(atomSvgUpdateTrigger);
    const { selectedItemNode } = get(atomTreeNode);
    return await itemBase64.readSvgAsync(selectedItemNode);
  },
  async (get, set, base64str: string) => {
    const { selectedItemNode } = get(atomTreeNode);
    if (!selectedItemNode) return;
    await itemBase64.saveSvgAsync(selectedItemNode, base64str);
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
    const { parentOrSelf: parent, selectedItemNode } = get(atomTreeNode);
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
    await appFileSystem.saveFolderDataAsync(parent);
  },
);

const atomSetFolderNodeAsync = atom(
  null,
  async (get, set, newFolder: FolderNode) => {
    const treeItems = get(_atomTree.dataTree);
    const { selectedFolderNode: folder } = get(atomTreeNode);
    if (!treeItems || !folder?.handle) return;
    if (newFolder.nodeId !== folder.nodeId) return;

    modifierFolderNode.modifyNewFolder(newFolder);
    folder.path = newFolder.path;
    folder.children = newFolder.children;
    set(_atomTree.dataTree, { ...treeItems });
    await appFileSystem.saveFolderDataAsync(folder);
  },
);

const atomAddItemEntryAsync = atom(null, async (get, set, item: ItemEntry) => {
  const { selectedFolderNode: folder } = get(atomTreeNode);
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
    const { selectedFolderNode: parent } = get(atomTreeNode);
    if (!treeItems || !parent?.handle) return;
    // フォルダの作成と保存
    if (!modifierFolderNode.canAddFolder(folder, parent)) return;
    modifierFolderNode.modifyNewFolder(folder);
    const subFolder = await createAndSaveFolderNode(folder, parent);
    if (!subFolder) return;
    // 親フォルダの更新
    parent.children = [subFolder, ...parent.children];
    set(_atomTree.dataTree, { ...treeItems });
    await appFileSystem.saveFolderDataAsync(parent);
  },
);

//|
//| export
//|

export const atomsSelected = {
  nodeId: atomNodeId,
  unselectAsync: atom(null, (_, set) => set(atomNodeId, undefined)),

  nodeValue: atomTreeNode,

  setReferencePathAsync: atomSetReferencePathAsync,

  svgBase64: atomSvgBase64,

  setItemNodeAsync: atomSetItemNodeAsync,
  setFolderNodeAsync: atomSetFolderNodeAsync,
  addItemEntryAsync: atomAddItemEntryAsync,
  addNewFolderNodeAsync: atomAddNewFolderNodeAsync,
};
