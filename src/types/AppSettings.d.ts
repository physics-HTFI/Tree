interface AppSettings {
  tiers?: TierSettings[];
  keys?: { key?: number; label?: string }[];
  speeds?: { speed?: number; label?: string }[];
  expressions?: {
    link?: string;
    pop?: string;
    frame?: string;
    is_url?: string;
    is_id?: string;
    search_id?: string;
  };
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
  frame?: {
    width?: number;
    height?: number;
    allow?: string;
    referrerPolicy?: HTMLAttributeReferrerPolicy;
  };
}

interface TierSettings {
  label?: string;
  color?: string;
  underline?: boolean;
}
