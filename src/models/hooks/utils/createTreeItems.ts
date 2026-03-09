import { createId } from "@/models/utils/createId";
import { appFileSystem } from "./appFileSystem";
import { fileName } from "../../utils/fileName";

export const createTreeItems = {
  fromDataFolder: createTreeItemsFromDataFolder,
  fromReferenceFolder: createTreeItemsFromReferenceFolder,
};

async function createTreeItemsFromReferenceFolder(
  handle: FileSystemDirectoryHandle | undefined,
  ignoreList?: string[],
  parentId: string = "reference/",
): Promise<FolderNode> {
  if (!handle)
    return { type: "folder", nodeId: "---", title: "---", children: [] };

  // FolderNodeを作成する
  const folderNode: FolderNode = {
    type: "folder",
    title: handle.name,
    nodeId: createId({ type: "folder", title: handle.name }, parentId),
    handle,
    isReference: true,
    children: [],
  };

  // フォルダ内のエントリを取得し、TreeNodeの配列を作成する
  for await (const entry of handle.values()) {
    if (entry.kind === "directory") {
      if (ignoreList?.includes(entry.name)) continue;
      const node = await createTreeItemsFromReferenceFolder(
        entry as FileSystemDirectoryHandle,
        ignoreList,
        folderNode.nodeId,
      );
      if (!node.children.length) continue;
      folderNode.children.push(node);
    } else {
      if (!fileName.isMp3File(entry.name)) continue;
      const data = {
        type: "item",
        title: fileName.baseName(entry.name),
        path: fileName.trimRootFromNodeId(`${folderNode.nodeId}${entry.name}`),
      } as const;
      folderNode.children.push({
        type: "item",
        nodeId: createId(data, folderNode.nodeId),
        parent: folderNode,
        hasSvg: false,
        entry: data,
        isReference: true,
      });
    }
  }

  folderNode.children.sort(sortChildrenByName);
  return folderNode;
}

async function createTreeItemsFromDataFolder(
  handle?: FileSystemDirectoryHandle,
  ignoreList?: string[],
  parentId: string = "data/",
): Promise<FolderNode> {
  if (!handle)
    return { type: "folder", nodeId: "---", title: "---", children: [] };

  // FolderNodeを作成する
  const folderData = await appFileSystem.readFolderJsonAsync(handle);
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
      const node = await createTreeItemsFromDataFolder(
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
        hasSvg: fileName.isSvgFile(entry.name),
        entry: data,
      });
    }
  }
  const sortedChildren = sortChildren(folderData, folderNode, children);
  folderNode.children = sortedChildren;

  const lengthChanged = folderData?.entries?.length !== sortedChildren.length;
  if (lengthChanged) await appFileSystem.saveFolderJsonAsync(folderNode);
  return folderNode;
}

function sortChildren(
  folderData: FolderJson,
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
        hasSvg: node?.type === "item" ? node.hasSvg : false,
        entry: entry,
      });
    }
  }

  return retval;
}

function isSameTitle(entry: EntryJson, node: TreeNode) {
  if (entry.type === "folder") {
    return node.type === "folder" ? entry.title === node.title : false;
  } else {
    return node.type === "item" ? entry.title === node.entry.title : false;
  }
}

function sortChildrenByName(a: TreeNode, b: TreeNode) {
  if (a.type === b.type) {
    const aTitle = a.type === "folder" ? a.title : (a.entry.title ?? "");
    const bTitle = b.type === "folder" ? b.title : (b.entry.title ?? "");
    return aTitle.localeCompare(bTitle, undefined, { numeric: true });
  }
  return a.type === "folder" ? -1 : 1;
}
