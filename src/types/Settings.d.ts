interface Settings {
  tiers?: Tier[];
  initialTicks?: number;
  searchUrl?: string;
  labels?: {
    folder?: Record<keyof FolderNode, string>;
    file?: Record<keyof FileNode, string>;
  };
}

interface Tier {
  label?: string;
  checked?: boolean;
  color?: string;
  underline?: boolean;
}
