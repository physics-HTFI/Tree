import { atom, useAtom } from "jotai";
import { _atomFolder } from "./share/_atomFolder";
import { _atomAppSettings } from "./share/_atomAppSettings";
import { appFileSystem } from "./share/appFileSystem";
import { _atomTreeItems } from "./share/_atomTreeItems";
import { createTreeItemsFromFolder } from "./share/createTreeItemsFromFolder";

const atomFolder = atom(
  (get) => get(_atomFolder),
  async (_, set, folder: FileSystemDirectoryHandle | null) => {
    set(_atomFolder, folder);

    // Settingsを読み込んでatomにセットする
    const settings = await appFileSystem.readAppSettingsAsync(folder);
    set(_atomAppSettings, settings ?? {});

    // フォルダからTreeItemsを生成してatomにセットする
    if (!settings?.tiers) return;
    set(_atomTreeItems, await createTreeItemsFromFolder(folder));
  },
);

export const useFolder = () => {
  const [folder, setFolder] = useAtom(atomFolder);
  return { isFolderSelected: !!folder, setFolderAsync: setFolder };
};
