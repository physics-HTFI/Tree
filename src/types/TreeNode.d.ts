// ツリーの構築に必要なデータのインターフェース

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
  hasSvg: boolean;
  entry: ItemEntry;
};

type NewFolderNode = {
  title: string;
  path?: string;
};
