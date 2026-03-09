// 保存対象となるデータのインターフェース

interface FolderJson {
  path?: string;
  entries?: EntryJson[];
}

type EntryJson = FolderEntry | ItemEntry;

interface FolderEntry {
  type: "folder";
  title: string;
}

interface ItemEntry {
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
