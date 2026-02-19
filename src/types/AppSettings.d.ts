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
    folder?: Record<Exclude<keyof FolderSettings, "order">, string>;
    file?: Record<Exclude<keyof FileSettings, "base64">, string>;
  };
  keys?: { key?: number; label?: string }[];
}
