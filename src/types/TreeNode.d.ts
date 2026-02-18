type TreeNode =
  | {
      type: "folder";
      nodeId: string;
      title: string;
      handle?: FileSystemDirectoryHandle;
      data: FolderNode;
      children?: TreeNode[];
    }
  | {
      type: "file";
      nodeId: string;
      title: string;
      data: FileNode;
      serial?: number;
    };

type FolderNode = {
  path?: string;
};

type FileNode = {
  path?: string;
  time?: number;
  start?: number;
  ticks?: number;
  key?: number;
  tier?: number;
  selected?: boolean;
  notes?: string;
};
