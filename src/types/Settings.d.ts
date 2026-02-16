interface Settings {
  tiers?: Tier[];
  searchUrl?: string;
  time?: {
    min?: number;
    max?: number;
  };
  start?: {
    min?: number;
    max?: number;
  };
  ticks?: {
    initialValue?: number;
    min?: number;
    max?: number;
  };
  labels?: {
    folder?: Record<keyof FolderNode, string>;
    file?: Record<keyof FileNode, string>;
  };
  keys?: string[];
}

interface Tier {
  label?: string;
  checked?: boolean;
  color?: string;
  underline?: boolean;
}
