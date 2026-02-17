import { useEffect, useState } from "react";
import {
  loadLastUsedFolderAsync,
  saveLastUsedFolderAsync,
} from "./lastUsedFolder";

export const useLastUsedFolderHandle = (
  onSelect: (handle: FileSystemDirectoryHandle) => void,
) => {
  const [lastUsedFolder, setLastUsedFolder] =
    useState<FileSystemDirectoryHandle | null>(null);

  // マウント時に、前回使用されたフォルダをIndexedDBから読み込む
  useEffect(() => {
    (async () => {
      setLastUsedFolder(await loadLastUsedFolderAsync());
    })().catch(() => undefined);
  }, []);

  const setLastUsedFolderAsync = async (
    handle: FileSystemDirectoryHandle | null,
  ) => {
    if (!handle) return;
    onSelect(handle);
    setLastUsedFolder(handle);
    await saveLastUsedFolderAsync(handle);
  };

  return { lastUsedFolder, setLastUsedFolderAsync };
};
