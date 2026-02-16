type TreeNode =
  | (FolderNode & {
      title?: string;
      handle?: FileSystemDirectoryHandle;
      children?: TreeNode[];
    })
  | FileNode;

interface FolderNode {
  id?: string;
}

interface FileNode {
  title?: string;
  id?: string;
  time?: number;
  start?: number;
  ticks?: number;
  key?: number;
  tier?: number;
  selected?: boolean;
  notes?: string;
}
