import { atom, useAtom, useAtomValue } from "jotai";
import { _atomFolder } from "./share/_atomFolder";
import { _atomAppSettings } from "./share/_atomAppSettings";
import { APP_SETTINGS_FILE_NAME } from "./share/SETTINGS_FILE_NAME";
import { fileSystem } from "./share/fileSystem";

const atomAppSettings = atom(
  (get) => get(_atomAppSettings),
  async (get, set, settings: AppSettings) => {
    set(_atomAppSettings, settings);

    // 設定ファイルを更新する
    const folder = get(_atomFolder);
    await fileSystem.saveAsync(folder, APP_SETTINGS_FILE_NAME, settings);
  },
);

export const useAppSettingsValue = () => useAtomValue(atomAppSettings);
export const useAppSettings = () => {
  const [settings, setSettings] = useAtom(atomAppSettings);
  return { settings, setSettingsAsync: setSettings };
};
