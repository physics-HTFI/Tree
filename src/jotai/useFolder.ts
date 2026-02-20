import { atom, useAtom } from "jotai";
import { _atomFolder } from "./share/_atomFolder";
import { _atomAppSettings } from "./share/_atomAppSettings";
import { fileSystem } from "./share/fileSystem";
import { _atomGetTreeItems } from "./share/_atomTreeItems";
import { createTreeItemsFromFolder } from "./share/createTreeItemsFromFolder";

const atomFolder = atom(
  (get) => get(_atomFolder),
  async (_, set, folder: FileSystemDirectoryHandle | null) => {
    set(_atomFolder, folder);

    // Settingsを読み込んでatomにセットする
    const settings = await fileSystem.readAppSettingsAsync(folder);
    set(_atomAppSettings, settings ?? {});

    // フォルダからTreeItemsを生成してatomにセットする
    set(_atomGetTreeItems, await createTreeItemsFromFolder(folder));
  },
);

export const useFolder = () => {
  const [folder, setFolder] = useAtom(atomFolder);
  return { isFolderSelected: !!folder, setFolderAsync: setFolder };
};
