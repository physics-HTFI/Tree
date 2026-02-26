import { fileSystem } from "@/generics/utils/fileSystem";
import { svgBase64 } from "./svgBase64";

const APP_SETTINGS_FILE_NAME = ".settings.json";
const DEFAULT_SVG_FILE_NAME = ".default.svg";
const FOLDER_DATA_FILE_NAME = ".folder.json";

export const appFileSystem = {
  readAppSettingsAsync: async (
    folder: FileSystemDirectoryHandle | null,
  ): Promise<AppSettings> =>
    (await fileSystem.parseJsonAsync<AppSettings>(
      folder,
      APP_SETTINGS_FILE_NAME,
    )) ?? {},

  readDefaultSvgBase64Async: async (
    folder: FileSystemDirectoryHandle | null,
  ): Promise<string | null> =>
    await svgBase64.readFromFileAsync(folder, DEFAULT_SVG_FILE_NAME),

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
