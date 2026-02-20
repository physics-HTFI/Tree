interface FolderData {
  path?: string;
  entries?: EntryData[];
}

type EntryData =
  | { type: "folder"; title: string }
  | { type: "item"; data: ItemData };

interface ItemData {
  title?: string;
  path?: string;
  time?: number;
  start?: number;
  ticks?: number;
  key?: number;
  tier?: number;
  highlighted?: boolean;
  notes?: string;
}
