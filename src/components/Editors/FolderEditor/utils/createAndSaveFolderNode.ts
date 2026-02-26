import { appFileSystem } from "@/jotai/utils/appFileSystem";
import { createId } from "@/utils/createId";

export async function createAndSaveFolderNode(
  folder: FolderNode,
  title: string,
  path?: string,
) {
  if (!folder.handle || !title) return null;
  try {
    const handle = await folder.handle.getDirectoryHandle(title, {
      create: true,
    });
    const folderNode: FolderNode = {
      type: "folder",
      title,
      path,
      nodeId: createId({ type: "folder", title }, folder.nodeId),
      handle: handle,
      children: [],
    };
    await appFileSystem.saveFolderDataAsync(folderNode);
    return folderNode;
  } catch {
    return null;
  }
}
