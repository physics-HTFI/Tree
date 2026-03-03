import { atom } from "jotai";

export const _atomFolders = atom<{
  data: FileSystemDirectoryHandle;
  reference: FileSystemDirectoryHandle;
} | null>(null);
