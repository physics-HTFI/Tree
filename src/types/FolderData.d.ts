interface FolderData {
  path?: string;
  entries?: (
    | { type: "folder"; title: string }
    | { type: "item"; item: ItemData }
  )[];
}

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
