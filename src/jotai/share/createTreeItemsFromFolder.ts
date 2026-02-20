import { fileSystem } from "./fileSystem";

const TARGET_EXTENSION = ".svg".toLocaleLowerCase();

export async function createTreeItemsFromFolder(
  handle: FileSystemDirectoryHandle | null,
  nodeId: string = "root",
): Promise<FolderNode> {
  if (!handle) return { type: "folder", nodeId, title: "---", children: [] };

  // フォルダ内のエントリを取得し、TreeNodeの配列を作成する
  const children: TreeNode[] = [];
  for await (const entry of handle.values()) {
    const path = `${nodeId}/${entry.name}`;
    if (entry.kind === "directory") {
      const node = await createTreeItemsFromFolder(
        entry as FileSystemDirectoryHandle,
        path,
      );
      children.push(node);
    } else {
      if (!entry.name.toLowerCase().endsWith(TARGET_EXTENSION)) continue;
      children.push({
        type: "item",
        nodeId: path,
        data: { title: entry.name },
      });
    }
  }

  // FolderNodeを作成する
  const folderData = await fileSystem.readFolderDataAsync(handle);
  const sortedChildren = sortNodes(folderData, children);
  const folderNode: FolderNode = {
    type: "folder",
    title: handle.name,
    nodeId,
    handle,
    path: folderData?.path,
    children: sortedChildren,
  };

  const lengthChanged = folderData?.entries?.length !== children.length;
  if (lengthChanged) await fileSystem.saveFolderDataAsync(handle, folderNode);
  return folderNode;
}

function sortNodes(folderData: FolderData, nodes: TreeNode[]): TreeNode[] {
  const retval: TreeNode[] = [];
  const isSameTitle = (entry: EntryData, node: TreeNode) =>
    (entry.type === "folder" ? entry : entry.data).title ===
    (node.type === "folder" ? node : node.data).title;

  // 未知のノードを追加
  for (const node of nodes) {
    const exists =
      undefined !==
      folderData.entries?.find((entry) => isSameTitle(entry, node));
    if (exists) continue;
    retval.push(node);
  }

  // 既知のノードをソートして追加
  for (const entry of folderData.entries ?? []) {
    let node = nodes.find((node) => isSameTitle(entry, node));
    if (!node) continue;
    if (node.type === "item" && entry.type === "item") {
      node = { ...node, data: { ...node.data, ...entry.data } };
    }
    retval.push(node);
  }

  return retval;
}
