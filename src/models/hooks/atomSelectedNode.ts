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

const atomUpdateItemNodeAsync = atom(
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

const atomUpdateFolderNodeAsync = atom(
  null,
  async (
    _get,
    set,
    diff: {
      path?: string;
      children?: TreeNode[];
      newItem?: ItemEntry;
      newFolder?: NewFolderNode;
    },
    folder: FolderNode,
  ) => {
    // 引数でfolderを渡すようにしている理由：
    // 選択ノードを関数内で取得すると、デバウンス後に別のノードが入っている可能性があってまずい。

    if (diff.path !== undefined) folder.path = diff.path;

    const newChildren: (TreeNode | undefined)[] = [];
    if (diff.newItem)
      newChildren.push(createNode.itemNode(diff.newItem, folder));
    if (diff.newFolder)
      newChildren.push(await createNode.folderNode(diff.newFolder, folder));
    folder.children = [
      ...newChildren.filter((c) => c !== undefined),
      ...(diff.children || folder.children),
    ];

    validateFolderNode.modifyNewFolder(folder);
    set(_atomTree.updateTree);
    await appFileSystem.saveFolderJsonAsync(folder);
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

  updateItemNodeAsync: atomUpdateItemNodeAsync,
  updateFolderNodeAsync: atomUpdateFolderNodeAsync,
};
