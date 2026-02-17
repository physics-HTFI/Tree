import { openDB } from "idb";

const DB_NAME = "records-db";
const DB_VERSION = 1;
const STORE_NAME = "last-used";
const STORE_KEY = "folder";

async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

export async function saveLastUsedFolderAsync(
  handle: FileSystemDirectoryHandle,
): Promise<void> {
  if (!("indexedDB" in window)) return;
  try {
    const db = await getDB();
    await db.put(STORE_NAME, handle, STORE_KEY);
  } catch (err) {
    console.error("setLastUsedFolder: failed to store handle", err);
  }
}

export async function loadLastUsedFolderAsync(): Promise<FileSystemDirectoryHandle | null> {
  if (!("indexedDB" in window)) return null;
  try {
    const db = await getDB();
    const handle = (await db.get(STORE_NAME, STORE_KEY)) as
      | FileSystemDirectoryHandle
      | undefined;
    return handle ?? null;
  } catch (err) {
    console.error("getLastUsedFolder: failed to read handle", err);
    return null;
  }
}
