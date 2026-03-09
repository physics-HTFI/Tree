import { fileSystem } from "@/generics/utils/fileSystem";
import { itemBase64 } from "./itemBase64";

export const appFileSystem = {
  readSettingsJsonAsync,
  readDefaultSvgBase64Async,
  readFaviconSvgBase64Async,

  readReferenceJsonAsync,
  saveReferenceJsonAsync,

  readFolderJsonAsync,
  saveFolderJsonAsync,
};

const APP_SETTINGS_FILE_NAME = ".settings.json";
const REFERENCE_DATA_FILE_NAME = ".reference.json";
const DEFAULT_SVG_FILE_NAME = ".default.svg";
const FOLDER_DATA_FILE_NAME = ".folder.json";
const FAVICON_SVG_FILE_NAME = ".favicon.svg";

async function readSettingsJsonAsync(
  folder?: FileSystemDirectoryHandle,
): Promise<SettingsJson | undefined> {
  return await fileSystem.parseJsonAsync<SettingsJson>(
    folder,
    APP_SETTINGS_FILE_NAME,
  );
}

async function readDefaultSvgBase64Async(
  folder?: FileSystemDirectoryHandle,
): Promise<string | undefined> {
  return await itemBase64.readSvgFromFileAsync(folder, DEFAULT_SVG_FILE_NAME);
}

async function readFaviconSvgBase64Async(
  folder?: FileSystemDirectoryHandle,
): Promise<string | undefined> {
  return await itemBase64.readSvgFromFileAsync(folder, FAVICON_SVG_FILE_NAME);
}

async function readReferenceJsonAsync(
  folder?: FileSystemDirectoryHandle,
): Promise<ReferenceJson | undefined> {
  return await fileSystem.parseJsonAsync<ReferenceJson>(
    folder,
    REFERENCE_DATA_FILE_NAME,
  );
}

async function saveReferenceJsonAsync(
  folder: FileSystemDirectoryHandle | undefined,
  referenceData: ReferenceJson,
): Promise<boolean> {
  return await fileSystem.saveAsJsonAsync<ReferenceJson>(
    folder,
    REFERENCE_DATA_FILE_NAME,
    referenceData,
  );
}

async function readFolderJsonAsync(folder?: FileSystemDirectoryHandle) {
  return (
    (await fileSystem.parseJsonAsync<FolderJson>(
      folder,
      FOLDER_DATA_FILE_NAME,
    )) ?? {}
  );
}

async function saveFolderJsonAsync(folder: FolderNode) {
  const folderData: FolderJson = {
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

  const isOk = await fileSystem.saveAsJsonAsync<FolderJson>(
    folder.handle,
    FOLDER_DATA_FILE_NAME,
    folderData,
    formatFolderData,
  );
  if (!isOk) alert("フォルダデータの保存に失敗しました");
}
