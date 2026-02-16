import { atom, useAtom, useAtomValue } from "jotai";
import { _atomFolder } from "./share/_atomFolder";
import { _atomSettings } from "./share/_atomSettings";
import { SETTINGS_FILE_NAME } from "./share/SETTINGS_FILE_NAME";
import { fileSystem } from "./share/fileSystem";

const atomSettings = atom(
  (get) => get(_atomSettings),
  async (get, set, settings: Settings) => {
    set(_atomSettings, settings);

    // 設定ファイルを更新する
    const folder = get(_atomFolder);
    await fileSystem.saveAsync(folder, SETTINGS_FILE_NAME, settings);
  },
);

export const useSettings = () => useAtom(atomSettings);
export const useSettingsValue = () => useAtomValue(atomSettings);
