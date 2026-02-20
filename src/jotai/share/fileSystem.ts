async function parseAsync<T>(
  folder: FileSystemDirectoryHandle | null,
  fileName: string,
): Promise<T | null> {
  if (!folder) return null;
  try {
    const fileHandle = await folder.getFileHandle(fileName);
    const file = await fileHandle.getFile();
    return JSON.parse(await file.text()) as T;
  } catch {
    return null;
  }
}

async function saveAsync<T>(
  folder: FileSystemDirectoryHandle | null,
  fileName: string,
  value: T,
) {
  if (!folder) return;
  try {
    const json = JSON.stringify(value, null, 2);
    const fileHandle = await folder.getFileHandle(fileName, {
      create: true,
    });
    const writable = await fileHandle.createWritable();
    await writable.write(json);
    await writable.close();
  } catch {
    return;
  }
}

const APP_SETTINGS_FILE_NAME = "app.settings.json";
const FOLDER_DATA_FILE_NAME = "folder.data.json";

export const fileSystem = {
  readFolderDataAsync: async (folder: FileSystemDirectoryHandle | null) =>
    (await parseAsync<FolderData>(folder, FOLDER_DATA_FILE_NAME)) ?? {},

  saveFolderDataAsync: async (
    folder: FileSystemDirectoryHandle | null,
    value: FolderData,
  ) => await saveAsync<FolderData>(folder, FOLDER_DATA_FILE_NAME, value),

  readAppSettingsAsync: async (folder: FileSystemDirectoryHandle | null) =>
    (await parseAsync<AppSettings>(folder, APP_SETTINGS_FILE_NAME)) ?? {},

  saveAppSettingsAsync: async (
    folder: FileSystemDirectoryHandle | null,
    value: AppSettings,
  ) => await saveAsync<AppSettings>(folder, APP_SETTINGS_FILE_NAME, value),
};
