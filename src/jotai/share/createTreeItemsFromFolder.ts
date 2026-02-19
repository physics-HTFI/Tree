import {
  APP_SETTINGS_FILE_NAME,
  FOLDER_SETTINGS_FILE_NAME,
} from "./SETTINGS_FILE_NAME";

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
      if (entry.name === APP_SETTINGS_FILE_NAME) continue;
      if (entry.name === FOLDER_SETTINGS_FILE_NAME) continue;
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
