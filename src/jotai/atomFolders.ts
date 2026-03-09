import { atom } from "jotai";
import { appFileSystem } from "./utils/appFileSystem";
import { _atomTree } from "./backings/_atomTree";
import { createTreeItems } from "./utils/createTreeItems";
import { _atomReferenceJson } from "./backings/_atomReferenceJson";
import { _atomFolders } from "./backings/_atomFolders";
import { setFaviconSvg } from "./utils/setFaviconSvg";
import { atomSettingsJsonValue } from "./atomSettingsJson";

const setFoldersAsync = atom(
  null,
  async (
    get,
    set,
    folders: {
      data: FileSystemDirectoryHandle;
      reference: FileSystemDirectoryHandle;
    },
  ) => {
    await folders.data.requestPermission();
    await folders.reference.requestPermission();
    set(_atomFolders, folders);

    // ReferenceDataを読み込んでatomにセットする
    const referenceData = await appFileSystem.readReferenceJsonAsync(
      folders.data,
    );
    if (referenceData) set(_atomReferenceJson, referenceData);

    // フォルダからTreeItemsを生成してatomにセットする
    const settings = await get(atomSettingsJsonValue);
    if (!settings) return;
    set(
      _atomTree.dataTree,
      await createTreeItems.fromDataFolder(folders.data, settings.ignore),
    );
    set(
      _atomTree.referenceTree,
      await createTreeItems.fromReferenceFolder(folders.reference),
    );

    // ファビコンSVGを読み込んでセットする
    const faviconSvg = await appFileSystem.readFaviconSvgBase64Async(
      folders.data,
    );
    setFaviconSvg(faviconSvg);
  },
);

const isSelectedValue = atom((get) => !!get(_atomFolders));

export const atomsFolders = {
  setAsync: setFoldersAsync,
  isSelectedValue,
};
