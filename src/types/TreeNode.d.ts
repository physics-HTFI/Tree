type TreeNode =
  | (FolderNode & {
      type: "folder";
      nodeId: string;
      title?: string;
      handle?: FileSystemDirectoryHandle;
      children?: TreeNode[];
    })
  | (FileNode & {
      type: "file";
      nodeId: string;
      serial?: number;
    });

type FolderNode = {
  path?: string;
};

type FileNode = {
  title?: string;
  path?: string;
  time?: number;
  start?: number;
  ticks?: number;
  key?: number;
  tier?: number;
  selected?: boolean;
  notes?: string;
};
