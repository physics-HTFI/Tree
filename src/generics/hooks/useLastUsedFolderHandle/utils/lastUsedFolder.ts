import { openDB } from "idb";

const DB_NAME = "last-used-db";
const STORE_NAME = "last-used";
const DB_VERSION = 1;

export const lastUsedFolder = {
  saveAsync: saveLastUsedFolderAsync,
  loadAsync: loadLastUsedFolderAsync,
};

async function getDB() {
  return await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

async function saveLastUsedFolderAsync(
  key: string,
  handle: FileSystemDirectoryHandle,
): Promise<void> {
  if (!("indexedDB" in window)) return;
  try {
    const db = await getDB();
    await db.put(STORE_NAME, handle, key);
  } catch (err) {
    console.error("saveLastUsedFolder: failed to store handle", err);
  }
}

async function loadLastUsedFolderAsync(
  key: string,
): Promise<FileSystemDirectoryHandle | null> {
  if (!("indexedDB" in window)) return null;
  try {
    const db = await getDB();
    const handle = (await db.get(STORE_NAME, key)) as
      | FileSystemDirectoryHandle
      | undefined;
    return handle ?? null;
  } catch (err) {
    console.error("loadLastUsedFolder: failed to read handle", err);
    return null;
  }
}
