const APP_SETTINGS_FILE_NAME = "app.settings.json";
const FOLDER_DATA_FILE_NAME = "folder.data.json";

export const fileSystem = {
  readFolderDataAsync: async (folder: FileSystemDirectoryHandle | null) =>
    (await parseAsync<FolderData>(folder, FOLDER_DATA_FILE_NAME)) ?? {},

  saveFolderDataAsync: async (folder: FolderNode) => {
    const folderData: FolderData = {
      path: folder.path,
      entries: folder.children.map((child) =>
        child.type === "folder"
          ? { type: "folder", title: child.title }
          : child.data,
      ),
    };
    await saveAsync<FolderData>(
      folder.handle ?? null,
      FOLDER_DATA_FILE_NAME,
      folderData,
      formatFolderData,
    );
  },

  readAppSettingsAsync: async (
    folder: FileSystemDirectoryHandle | null,
  ): Promise<AppSettings> =>
    (await parseAsync<AppSettings>(folder, APP_SETTINGS_FILE_NAME)) ?? {},
};

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
  format?: (json: string) => string,
) {
  if (!folder) return;
  try {
    let json = JSON.stringify(value, null, 2);
    if (format) json = format(json);
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

function formatFolderData(json: string) {
  return json.replace(/\n\s{4}\s*(?!\{)/g, " ");
}
