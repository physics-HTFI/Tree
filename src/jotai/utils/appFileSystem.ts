import { fileSystem } from "@/generics/utils/fileSystem";
import { itemBase64 } from "./itemBase64";

const APP_SETTINGS_FILE_NAME = ".settings.json";
const REFERENCE_DATA_FILE_NAME = ".reference.json";
const DEFAULT_SVG_FILE_NAME = ".default.svg";
const FOLDER_DATA_FILE_NAME = ".folder.json";
const FAVICON_SVG_FILE_NAME = ".favicon.svg";

export const appFileSystem = {
  readAppSettingsAsync: async (
    folder: FileSystemDirectoryHandle | null,
  ): Promise<AppSettings | null> =>
    await fileSystem.parseJsonAsync<AppSettings>(
      folder,
      APP_SETTINGS_FILE_NAME,
    ),

  readReferenceDataAsync: async (
    folder: FileSystemDirectoryHandle | null,
  ): Promise<ReferenceData | null> =>
    await fileSystem.parseJsonAsync<ReferenceData>(
      folder,
      REFERENCE_DATA_FILE_NAME,
    ),

  saveReferenceDataAsync: async (
    folder: FileSystemDirectoryHandle | null,
    referenceData: ReferenceData,
  ): Promise<boolean> =>
    await fileSystem.saveAsJsonAsync<ReferenceData>(
      folder,
      REFERENCE_DATA_FILE_NAME,
      referenceData,
    ),

  readDefaultSvgBase64Async: async (
    folder: FileSystemDirectoryHandle | null,
  ): Promise<string | null> =>
    await itemBase64.readSvgFromFileAsync(folder, DEFAULT_SVG_FILE_NAME),

  readFaviconSvgBase64Async: async (
    folder: FileSystemDirectoryHandle | null,
  ): Promise<string | null> =>
    await itemBase64.readSvgFromFileAsync(folder, FAVICON_SVG_FILE_NAME),

  readFolderDataAsync: async (folder: FileSystemDirectoryHandle | null) =>
    (await fileSystem.parseJsonAsync<FolderData>(
      folder,
      FOLDER_DATA_FILE_NAME,
    )) ?? {},

  saveFolderDataAsync: async (folder: FolderNode) => {
    const folderData: FolderData = {
      path: folder.path,
      entries: folder.children.map((child) =>
        child.type === "folder"
          ? { type: "folder", title: child.title }
          : child.entry,
      ),
    };

    // 1項目を1行にまとめる関数
    const formatFolderData = (json: string) =>
      json.replace(/\n\s{4}\s*(?!\{)/g, " ");

    const isOk = await fileSystem.saveAsJsonAsync<FolderData>(
      folder.handle ?? null,
      FOLDER_DATA_FILE_NAME,
      folderData,
      formatFolderData,
    );
    if (!isOk) alert("フォルダデータの保存に失敗しました");
  },
};
