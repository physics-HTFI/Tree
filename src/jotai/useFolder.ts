import { atom, useSetAtom } from "jotai";
import { _atomFolder } from "./share/_atomFolder";
import { _atomSettings } from "./share/_atomSettings";
import { SETTINGS_FILE_NAME } from "./share/SETTINGS_FILE_NAME";
import { fileSystem } from "./share/fileSystem";

const atomSetFolder = atom(
  null,
  async (_, set, folder: FileSystemDirectoryHandle | null) => {
    set(_atomFolder, folder);

    // Settingsを読み込んでatomにセットする
    const settings = await fileSystem.parseAsync<Settings>(
      folder,
      SETTINGS_FILE_NAME,
    );
    set(_atomSettings, settings ?? {});
  },
);

export const useSetFolder = () => useSetAtom(atomSetFolder);
