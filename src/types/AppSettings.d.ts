interface AppSettings {
  tiers?: Tier[];
  initialTicks?: number;
  searchUrl?: string;
  viewUrls?: Record<number, string>;
  labels?: {
    folder?: Record<keyof FolderNode, string>;
    file?: Record<keyof FileNode, string>;
  };
}

interface Tier {
  label?: string;
  color?: "red" | "green" | "blue" | "black" | "gray";
  underline?: boolean;
}
