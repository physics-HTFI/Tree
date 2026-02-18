type TreeNode =
  | {
      type: "folder";
      nodeId: string;
      title: string;
      handle?: FileSystemDirectoryHandle;
      children: TreeNode[];
    }
  | {
      type: "file";
      nodeId: string;
      title: string;
      tier: number;
      hasTicks: boolean;
      key: number;
    };
