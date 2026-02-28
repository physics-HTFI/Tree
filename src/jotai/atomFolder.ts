import { atom } from "jotai";
import { appFileSystem } from "./utils/appFileSystem";
import { _atomAppSettings } from "./backings/_atomAppSettings";
import { _atomTreeItems } from "./backings/_atomTreeItems";
import { createTreeItemsFromFolder } from "./utils/createTreeItemsFromFolder";
import { _atomDefaultSvgBase64 } from "./backings/_atomDefaultSvgBase64";

const _atomFolder = atom<FileSystemDirectoryHandle | null>(null);

const setAsync = atom(
  null,
  async (_, set, folder: FileSystemDirectoryHandle | null) => {
    set(_atomFolder, folder);

    // Settingsを読み込んでatomにセットする
    const settings = await appFileSystem.readAppSettingsAsync(folder);
    set(_atomAppSettings, settings ?? {});

    // フォルダからTreeItemsを生成してatomにセットする
    if (!settings?.tiers) return;
    set(
      _atomTreeItems,
      await createTreeItemsFromFolder(folder, settings.ignore),
    );

    // デフォルトSVGを読み込んでatomにセットする
    const svg = await appFileSystem.readDefaultSvgBase64Async(folder);
    set(_atomDefaultSvgBase64, svg);
  },
);

const isSelectedValue = atom((get) => !!get(_atomFolder));

export const atomsFolder = {
  setAsync,
  isSelectedValue,
};
