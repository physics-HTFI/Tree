import { atom } from "jotai";
import { _atomFolder } from "./backings/_atomFolder";
import { appFileSystem } from "./utils/appFileSystem";
import { atomAppSettings } from "./atomAppSettings";
import { _atomTreeItems } from "./backings/_atomTreeItems";
import { createTreeItemsFromFolder } from "./utils/createTreeItemsFromFolder";

const atomSetFolder = atom(
  null,
  async (_, set, folder: FileSystemDirectoryHandle | null) => {
    set(_atomFolder, folder);

    // Settingsを読み込んでatomにセットする
    const settings = await appFileSystem.readAppSettingsAsync(folder);
    set(atomAppSettings, settings ?? {});

    // フォルダからTreeItemsを生成してatomにセットする
    if (!settings?.tiers) return;
    set(_atomTreeItems, await createTreeItemsFromFolder(folder));
  },
);

const atomIsFolderSelected = atom((get) => !!get(_atomFolder));

export const atomFolder = {
  atomSetFolder,
  atomIsFolderSelected,
};
