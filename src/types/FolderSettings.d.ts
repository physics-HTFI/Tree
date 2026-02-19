interface FolderSettings {
  path?: string;
  order?: {
    folder: string[];
    file: { title?: string; tier?: number; hasTicks?: boolean; key?: number }[];
  };
}
