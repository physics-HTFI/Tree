import { fileSystem } from "../../../generics/utils/fileSystem";

const APP_SETTINGS_FILE_NAME = "app.settings.json";
const FOLDER_DATA_FILE_NAME = "folder.data.json";

export const appFileSystem = {
  readAppSettingsAsync: async (
    folder: FileSystemDirectoryHandle | null,
  ): Promise<AppSettings> =>
    (await fileSystem.parseJsonAsync<AppSettings>(
      folder,
      APP_SETTINGS_FILE_NAME,
    )) ?? {},

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
    await fileSystem.saveAsJsonAsync<FolderData>(
      folder.handle ?? null,
      FOLDER_DATA_FILE_NAME,
      folderData,
      formatFolderData,
    );
  },
};

/** 1項目を1行にまとめる */
function formatFolderData(json: string) {
  return json.replace(/\n\s{4}\s*(?!\{)/g, " ");
}
