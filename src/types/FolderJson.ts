// 保存対象となるデータのインターフェース

export interface FolderJson {
  path?: string;
  entries?: EntryJson[];
}

export type EntryJson = FolderEntry | ItemEntry;

export interface FolderEntry {
  type: "folder";
  title: string;
}

export interface ItemEntry {
  type: "item";
  title?: string;
  path?: string;
  speed?: number;
  start?: number;
  ticks?: number;
  key?: number;
  tier?: number;
  highlighted?: boolean;
  window?: boolean;
  notes?: string;
}
