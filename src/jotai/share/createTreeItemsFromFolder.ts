import { createId } from "../../utils/createId";
import { fileName } from "./fileName";
import { fileSystem } from "./fileSystem";

export async function createTreeItemsFromFolder(
  handle: FileSystemDirectoryHandle | null,
): Promise<FolderNode> {
  if (!handle)
    return { type: "folder", nodeId: "---", title: "---", children: [] };

  // FolderNodeを作成する
  const folderData = await fileSystem.readFolderDataAsync(handle);
  const folderNode: FolderNode = {
    type: "folder",
    title: handle.name,
    nodeId: createId(),
    handle,
    path: folderData?.path,
    children: [],
  };

  // フォルダ内のエントリを取得し、TreeNodeの配列を作成する
  const children: TreeNode[] = [];
  for await (const entry of handle.values()) {
    if (entry.kind === "directory") {
      const node = await createTreeItemsFromFolder(
        entry as FileSystemDirectoryHandle,
      );
      children.push(node);
    } else {
      if (!fileName.isSvgFile(entry.name)) continue;
      children.push({
        type: "item",
        nodeId: createId(),
        parent: folderNode,
        hasSvg: true,
        data: { title: fileName.baseName(entry.name) },
      });
    }
  }
  const sortedChildren = sortChildren(folderData, folderNode, children);
  folderNode.children = sortedChildren;

  const lengthChanged = folderData?.entries?.length !== children.length;
  if (lengthChanged) await fileSystem.saveFolderDataAsync(folderNode);
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
        nodeId: createId(),
        parent: parentNode,
        hasSvg: !!node,
        data: entry.data,
      });
    }
  }

  return retval;
}

function isSameTitle(entry: EntryData, node: TreeNode) {
  if (entry.type === "folder") {
    return node.type === "folder" ? entry.title === node.title : false;
  } else {
    return node.type === "item" ? entry.data.title === node.data.title : false;
  }
}
