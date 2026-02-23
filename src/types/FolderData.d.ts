interface FolderData {
  path?: string;
  entries?: EntryData[];
}

type EntryData = { type: "folder"; title: string } | ItemData;

interface ItemData {
  type: "item";
  title?: string;
  path?: string;
  time?: number;
  start?: number;
  ticks?: number;
  key?: number;
  tier?: number;
  highlighted?: boolean;
  window?: boolean;
  notes?: string;
}
