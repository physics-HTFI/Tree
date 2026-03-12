// ツリーの構築に必要なデータのインターフェース

import type { ItemEntry } from "./FolderJson";

export type TreeNode = FolderNode | ItemNode;

export interface FolderNode {
  type: "folder";
  nodeId: string;
  parent?: FolderNode;
  title: string;
  handle?: FileSystemDirectoryHandle;
  path?: string;
  isReference?: boolean;
  children: TreeNode[];
}

export interface ItemNode {
  type: "item";
  nodeId: string;
  parent: FolderNode;
  hasSvg: boolean;
  isReference?: boolean;
  entry: ItemEntry;
}

export interface NewFolderNode {
  title: string;
  path?: string;
}
