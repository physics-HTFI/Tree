interface AppSettings {
  tiers?: TierSettings[];
  searchExpression?: string;
  time?: {
    min?: number;
    max?: number;
  };
  start?: {
    min?: number;
    max?: number;
  };
  ticks?: {
    min?: number;
    max?: number;
  };
  labels?: {
    folder?: Record<Exclude<keyof FolderData, "order">, string>;
    file?: Record<keyof ItemData, string>;
  };
  keys?: { key?: number; label?: string }[];
}

interface TierSettings {
  label?: string;
  checked?: boolean;
  color?: string;
  underline?: boolean;
}
