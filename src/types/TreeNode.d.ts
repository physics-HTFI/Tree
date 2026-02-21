type TreeNode = FolderNode | ItemNode;

type FolderNode = {
  type: "folder";
  nodeId: string;
  title: string;
  handle?: FileSystemDirectoryHandle;
  path?: string;
  children: TreeNode[];
};

type ItemNode = {
  type: "item";
  nodeId: string;
  parent: FolderNode;
  data: ItemData;
};
