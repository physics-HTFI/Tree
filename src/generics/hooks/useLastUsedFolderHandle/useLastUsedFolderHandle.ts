import { useEffect, useState } from "react";
import { lastUsedFolder } from "./utils/lastUsedFolder";

export const useLastUsedFolderHandle = () => {
  const [folder, setFolder] = useState<FileSystemDirectoryHandle | null>(null);

  // マウント時に、前回使用されたフォルダをIndexedDBから読み込む
  useEffect(() => {
    (async () => setFolder(await lastUsedFolder.loadAsync()))().catch(
      () => undefined,
    );
  }, []);

  const saveLastUsedFolderHandleAsync = async (
    handle: FileSystemDirectoryHandle | null,
  ) => {
    if (!handle) return;
    setFolder(handle);
    await lastUsedFolder.saveAsync(handle);
  };

  return {
    lastUsedFolderHandle: folder,
    saveLastUsedFolderHandleAsync,
  };
};
