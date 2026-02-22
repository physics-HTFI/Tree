interface AppSettings {
  tiers?: TierSettings[];
  searchExpression?: string;
  defaults: {
    time?: number;
    start?: number;
    ticks?: number;
  };
  labels?: {
    folder?: Record<Exclude<keyof FolderData, "entries">, string>;
    file?: Record<keyof ItemData, string>;
  };
  keys?: { key?: number; label?: string }[];
}

interface TierSettings {
  label?: string;
  color?: string;
  underline?: boolean;
}
