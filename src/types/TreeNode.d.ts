type TreeNode =
  | ({ type: "folder" } & FolderNode)
  | ({ type: "file" } & FileNode);

interface FolderNode {
  title?: string;
  id?: string;
  children?: TreeFile[];
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
