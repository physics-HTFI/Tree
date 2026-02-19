export async function createTreeItemsFromFolder(
  folder: FileSystemDirectoryHandle | null,
  parent: string = "",
): Promise<TreeNode[]> {
  if (!folder) return [];
  const folderItems: TreeNode[] = [];
  const fileItems: TreeNode[] = [];
  for await (const entry of folder.values()) {
    const path = `${parent}/${entry.name}`;
    if (entry.kind === "directory") {
      const handle = entry as FileSystemDirectoryHandle;
      folderItems.push({
        type: "folder",
        nodeId: path,
        title: entry.name,
        handle,
        children: await createTreeItemsFromFolder(handle, path),
      });
    } else {
      fileItems.push({
        type: "file",
        nodeId: path,
        title: entry.name,
        tier: 0,
      });
    }
  }
  return folderItems.concat(fileItems);
}
