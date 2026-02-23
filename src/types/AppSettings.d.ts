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
    model_enabled?: string;
    model_disabled?: string;
  };
  labels?: Record<
    keyof ItemData | Exclude<keyof FolderData, "entries">,
    string
  >;
  keys?: { key?: number; label?: string }[];
}

interface TierSettings {
  label?: string;
  color?: string;
  underline?: boolean;
}
