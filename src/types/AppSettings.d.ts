interface AppSettings {
  tiers?: TierSettings[];
  linkExpression?: string;
  defaults?: {
    time?: number;
    start?: number;
    ticks?: number;
  };
  buttons?: {
    link?: string;
    edit?: string;
    tick?: string;
    close?: string;
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
