import { atom } from "jotai";

const SETTINGS_FILE_NAME = ".settings.json";

const _atomFolder = atom<FileSystemDirectoryHandle | null>(null);
const _atomSettings = atom<Settings>({});

export const atomSetFolder = atom(
  null,
  async (_, set, folder: FileSystemDirectoryHandle | null) => {
    set(_atomFolder, folder);

    // 設定ファイルを読み込む
    let settings: Settings = {};
    try {
      if (!folder) return;
      const fileHandle = await folder.getFileHandle(SETTINGS_FILE_NAME);
      const file = await fileHandle.getFile();
      settings = JSON.parse(await file.text()) as Settings;
    } catch {
      console.log(`Failed to load "${SETTINGS_FILE_NAME}"`);
    } finally {
      set(_atomSettings, settings);
    }
  },
);

export const atomSettings = atom(
  (get) => get(_atomSettings),
  async (get, set, settings: Settings) => {
    set(_atomSettings, settings);

    // 設定ファイルを書き込む
    try {
      const folder = get(_atomFolder);
      if (!folder) return;
      const json = JSON.stringify(settings, null, 2);
      const fileHandle = await folder.getFileHandle(SETTINGS_FILE_NAME, {
        create: true,
      });
      const writable = await fileHandle.createWritable();
      await writable.write(json);
      await writable.close();
    } catch {
      console.log("Failed to save settings.");
    }
  },
);
