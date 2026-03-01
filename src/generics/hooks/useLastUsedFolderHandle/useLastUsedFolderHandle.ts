import { useEffect, useState } from "react";
import { lastUsedFolder } from "./utils/lastUsedFolder";

export const useLastUsedFolderHandle = (key: string) => {
  const [folder, setFolder] = useState<FileSystemDirectoryHandle | null>(null);

  // マウント時に、前回使用されたフォルダをIndexedDBから読み込む
  useEffect(() => {
    (async () => setFolder(await lastUsedFolder.loadAsync(key)))().catch(
      () => undefined,
    );
  }, [key]);

  const saveLastUsedFolderHandleAsync = async (
    handle: FileSystemDirectoryHandle | null,
  ) => {
    if (!handle) return;
    setFolder(handle);
    await lastUsedFolder.saveAsync(key, handle);
  };

  return {
    lastUsedFolderHandle: folder,
    saveLastUsedFolderHandleAsync,
  };
};
