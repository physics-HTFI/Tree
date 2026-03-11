import { atom } from "jotai";
import { _atomTree } from "./backings/_atomTree";
import { appFileSystem } from "./utils/appFileSystem";
import { createNode } from "@/models/hooks/utils/createNode";
import { validateFolderNode } from "@/models/validators/validateFolderNode";
import { validateItemNode } from "@/models/validators/validateItemNode";
import { _atomsSelectedNode } from "./backings/_atomSelectedNode";
import { media } from "./utils/media";

//|
//| 選択されたノードのメディアに関するatom
//|

const atomSvgBase64 = atom(
  async (get) => {
    const { itemNode } = await get(_atomsSelectedNode.nodeValue);
    return await media.base64.readSvgAsync(itemNode);
  },
  async (_get, set, base64str: string, itemNode: ItemNode) => {
    await media.base64.saveSvgAsync(itemNode, base64str);
    itemNode.hasSvg = true;
    set(_atomTree.updateTree);
  },
);

const atomAudioBase64Value = atom(async (get) => {
  const referenceTree = await get(_atomTree.referenceTreeValue);
  const { itemNode } = await get(_atomsSelectedNode.nodeValue);
  const path = itemNode?.entry.path;
  return await media.base64.readMp3Async(referenceTree, path);
});

//|
//| 選択されたノードの更新に関するatom
//|

const atomSetItemNodeAsync = atom(
  null,
  async (_get, set, newItemEntry: ItemEntry, itemNode: ItemNode) => {
    validateItemNode.modifyItemNode(newItemEntry);
    const canOverwrite = validateItemNode.canOverwrite(newItemEntry, itemNode);
    if (!canOverwrite) return;

    // SVGファイルの名前を変更（タイトルが変更された場合）
    const isOk = await media.renameSvgFileAsync(itemNode, newItemEntry);
    if (!isOk) return;

    // selectedItemNode を更新
    itemNode.entry = {
      ...itemNode.entry,
      ...newItemEntry,
    };
    set(_atomTree.updateTree);
    await appFileSystem.saveFolderJsonAsync(itemNode.parent);
  },
);

const atomSetFolderNodeAsync = atom(
  null,
  async (
    _get,
    set,
    diff: { path?: string; children?: TreeNode[]; newChild?: TreeNode },
    folder: FolderNode,
  ) => {
    // 引数でfolderを渡すようにしている。（選択ノードを使うと、デバウンス後に別のノードが入っている可能性があってまずい。）

    if (diff.path !== undefined) folder.path = diff.path;
    if (diff.children) folder.children = diff.children;
    if (diff.newChild) folder.children = [diff.newChild, ...folder.children];
    validateFolderNode.modifyNewFolder(folder);
    set(_atomTree.updateTree);
    await appFileSystem.saveFolderJsonAsync(folder);
  },
);

const atomAddItemEntryAsync = atom(
  null,
  async (_get, set, item: ItemEntry, parent: FolderNode) => {
    const newItem = createNode.itemNode(item, parent);
    await set(atomSetFolderNodeAsync, { newChild: newItem }, parent);
  },
);

const atomAddNewFolderNodeAsync = atom(
  null,
  async (_get, set, folder: NewFolderNode, parent: FolderNode) => {
    const newFolder = await createNode.folderNode(folder, parent);
    await set(atomSetFolderNodeAsync, { newChild: newFolder }, parent);
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
