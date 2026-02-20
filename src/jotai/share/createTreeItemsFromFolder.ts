import { fileSystem } from "./fileSystem";

const TARGET_EXTENSION = ".svg".toLocaleLowerCase();

export async function createTreeItemsFromFolder(
  folder: FileSystemDirectoryHandle | null,
  parent: string = "",
): Promise<TreeNode[]> {
  if (!folder) return [];

  // フォルダ内のエントリを取得し、TreeNodeの配列を作成する
  const nodes: TreeNode[] = [];
  for await (const entry of folder.values()) {
    const path = `${parent}/${entry.name}`;
    if (entry.kind === "directory") {
      const handle = entry as FileSystemDirectoryHandle;
      nodes.push({
        type: "folder",
        nodeId: path,
        title: handle.name,
        handle,
        children: await createTreeItemsFromFolder(handle, path),
      });
    } else {
      if (!entry.name.toLowerCase().endsWith(TARGET_EXTENSION)) continue;
      nodes.push({
        type: "item",
        nodeId: path,
        title: entry.name,
      });
    }
  }

  const folderData = await fileSystem.readFolderDataAsync(folder);
  const sortedNodes = sortNodes(folderData, nodes);

  return sortedNodes;
}

function sortNodes(folderData: FolderData, nodes: TreeNode[]): TreeNode[] {
  const retval: TreeNode[] = [];

  // 未知のノードを追加
  for (const node of nodes) {
    const exists =
      undefined !==
      folderData.entries?.find(
        (entry) =>
          (entry.type === "folder" ? entry : entry.item).title === node.title,
      );
    if (exists) continue;
    retval.push(node);
  }

  // 既知のノードをソートして追加
  for (const entry of folderData.entries ?? []) {
    let node = nodes.find(
      (node) =>
        (entry.type === "folder" ? entry : entry.item).title === node.title,
    );
    if (!node) continue;
    if (node.type === "item" && entry.type === "item") {
      node = { ...node, ...entry.item };
    }
    retval.push(node);
  }

  return retval;
}
