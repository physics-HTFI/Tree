import { useEffect, useState } from "react";
import {
  loadLastUsedFolderAsync,
  saveLastUsedFolderAsync,
} from "./lastUsedFolder";
import { pickLocalFolder } from "./pickLocalFolder";

type Props = {
  isOpen: boolean;
  onSelect: (handle: FileSystemDirectoryHandle) => void;
};

export function FolderPicker({ isOpen, onSelect }: Props) {
  // マウント時に、前回使用されたフォルダをIndexedDBから読み込む
  const [lastUsed, setLastUsed] = useState<FileSystemDirectoryHandle | null>(
    null,
  );
  useEffect(() => {
    (async () => {
      setLastUsed(await loadLastUsedFolderAsync());
    })();
  }, []);

  const handleSelect = async (handle: FileSystemDirectoryHandle | null) => {
    if (!handle) return;
    onSelect(handle);
    await saveLastUsedFolderAsync(handle);
  };

  const pickFolder = async () => await handleSelect(await pickLocalFolder());
  const pickLastUsed = async () => await handleSelect(lastUsed);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative bg-white text-gray-900 rounded-lg shadow-lg w-11/12 max-w-md p-6 z-10">
        <h2 className="text-lg font-semibold mb-4">フォルダーを選択</h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={pickFolder}
        >
          フォルダーを選択
        </button>
        <h2 className="text-lg font-semibold my-4">前回使用されたフォルダー</h2>
        {lastUsed ? (
          <button
            className="px-4 py-2 bg-transparent dark:bg-gray-700 text-blue-600 rounded-md hover:bg-gray-100"
            onClick={pickLastUsed}
          >
            {lastUsed.name}
          </button>
        ) : (
          "なし"
        )}
      </div>
    </div>
  );
}
