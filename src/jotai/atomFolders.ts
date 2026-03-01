import { atom } from "jotai";
import { appFileSystem } from "./utils/appFileSystem";
import { _atomAppSettings } from "./backings/_atomAppSettings";
import { _atomTree } from "./backings/_atomTree";
import { createTreeItems } from "./utils/createTreeItems";
import { _atomDefaultSvgBase64 } from "./backings/_atomDefaultSvgBase64";

const _atomFolders = atom<{
  data: FileSystemDirectoryHandle;
  reference: FileSystemDirectoryHandle;
} | null>(null);

const setAsync = atom(
  null,
  async (
    _,
    set,
    folders: {
      data: FileSystemDirectoryHandle;
      reference: FileSystemDirectoryHandle;
    },
  ) => {
    await folders.data.requestPermission();
    await folders.reference.requestPermission();
    set(_atomFolders, folders);

    // Settingsを読み込んでatomにセットする
    const settings = await appFileSystem.readAppSettingsAsync(folders.data);
    if (!settings) return;
    set(_atomAppSettings, settings);

    // フォルダからTreeItemsを生成してatomにセットする
    if (!settings?.tiers) return;
    set(
      _atomTree.dataTree,
      await createTreeItems.fromDataFolder(folders.data, settings.ignore),
    );
    console.log(await createTreeItems.fromReferenceFolder(folders.reference));
    set(
      _atomTree.referenceTree,
      await createTreeItems.fromReferenceFolder(folders.reference),
    );

    // デフォルトSVGを読み込んでatomにセットする
    const svg = await appFileSystem.readDefaultSvgBase64Async(folders.data);
    set(_atomDefaultSvgBase64, svg);
  },
);

const isSelectedValue = atom((get) => !!get(_atomFolders));

export const atomsFolders = {
  setAsync,
  isSelectedValue,
};
