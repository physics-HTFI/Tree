import { createId } from "@/utils/createId";
import { appFileSystem } from "./appFileSystem";
import { fileName } from "./fileName";

export async function createTreeItemsFromFolder(
  handle: FileSystemDirectoryHandle | null,
  ignoreList?: string[],
  parentId: string = "",
): Promise<FolderNode> {
  if (!handle)
    return { type: "folder", nodeId: "---", title: "---", children: [] };

  // FolderNodeを作成する
  const folderData = await appFileSystem.readFolderDataAsync(handle);
  const folderNode: FolderNode = {
    type: "folder",
    title: handle.name,
    nodeId: createId({ type: "folder", title: handle.name }, parentId),
    handle,
    path: folderData?.path,
    children: [],
  };

  // フォルダ内のエントリを取得し、TreeNodeの配列を作成する
  const children: TreeNode[] = [];
  for await (const entry of handle.values()) {
    if (entry.kind === "directory") {
      if (ignoreList?.includes(entry.name)) continue;
      const node = await createTreeItemsFromFolder(
        entry as FileSystemDirectoryHandle,
        ignoreList,
        folderNode.nodeId,
      );
      children.push(node);
    } else {
      if (!fileName.isSvgFile(entry.name)) continue;
      const data = {
        type: "item",
        title: fileName.baseName(entry.name),
      } as const;
      children.push({
        type: "item",
        nodeId: createId(data, folderNode.nodeId),
        parent: folderNode,
        hasSvg: true,
        entry: data,
      });
    }
  }
  const sortedChildren = sortChildren(folderData, folderNode, children);
  folderNode.children = sortedChildren;

  const lengthChanged = folderData?.entries?.length !== children.length;
  if (lengthChanged) await appFileSystem.saveFolderDataAsync(folderNode);
  return folderNode;
}

function sortChildren(
  folderData: FolderData,
  parentNode: FolderNode,
  childNodes: TreeNode[],
): TreeNode[] {
  const retval: TreeNode[] = [];

  // 未知のノードを追加
  for (const node of childNodes) {
    const exists =
      undefined !==
      folderData.entries?.find((entry) => isSameTitle(entry, node));
    if (exists) continue;
    retval.push(node);
  }

  // 既知のノードをソートして追加
  for (const entry of folderData.entries ?? []) {
    const node = childNodes.find((node) => isSameTitle(entry, node));
    if (entry.type === "folder") {
      if (!node) continue;
      retval.push(node);
    } else {
      retval.push({
        type: "item",
        nodeId: createId(entry, parentNode.nodeId),
        parent: parentNode,
        hasSvg: !!node,
        entry: entry,
      });
    }
  }

  return retval;
}

function isSameTitle(entry: EntryData, node: TreeNode) {
  if (entry.type === "folder") {
    return node.type === "folder" ? entry.title === node.title : false;
  } else {
    return node.type === "item" ? entry.title === node.entry.title : false;
  }
}
