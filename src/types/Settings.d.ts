interface AppSettings {
  tiers?: TierSettings[];
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
    folder?: Record<Exclude<keyof FolderSettings, "order">, string>;
    file?: Record<Exclude<keyof FileSettings, "base64">, string>;
  };
  keys?: Record<number, string>;
}

interface TierSettings {
  label?: string;
  checked?: boolean;
  color?: string;
  underline?: boolean;
}

interface FolderSettings {
  path?: string;
  order?: { title?: string; tier?: number; hasTicks?: boolean; key?: number }[];
}

interface FileSettings {
  path?: string;
  time?: number;
  start?: number;
  ticks?: number;
  key?: number;
  tier?: number;
  selected?: boolean;
  notes?: string;
  base64?: string;
}
