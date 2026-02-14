import React from "react";

type Props = {
  isOpen: boolean;
  onSelect: (handle: FileSystemDirectoryHandle) => void;
  lastUsedFolder?: FileSystemDirectoryHandle | null;
};

export default function FolderPicker({
  isOpen,
  onSelect,
  lastUsedFolder,
}: Props) {
  if (!isOpen) return null;

  const pickDirectory = async () => {
    if (!window.showDirectoryPicker) return;
    try {
      const handle = await window.showDirectoryPicker();
      if (handle) onSelect(handle);
    } catch (e) {
      // user aborted or error; do nothing
      console.error("Directory pick cancelled or failed", e);
    }
  };

  const pickLastUsed = () => {
    if (lastUsedFolder) onSelect(lastUsedFolder);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg shadow-lg w-11/12 max-w-md p-6 z-10">
        <h2 className="text-lg font-semibold mb-4">フォルダを選択</h2>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
          ブラウザのディレクトリピッカーを使ってローカルのフォルダを選択してください。
        </p>
        <div className="flex gap-3">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={pickDirectory}
          >
            フォルダを選択
          </button>
          {lastUsedFolder && (
            <button
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-md hover:bg-gray-300"
              onClick={pickLastUsed}
            >
              前回使用されたフォルダ: {lastUsedFolder.name}
            </button>
          )}
        </div>
        {!window.showDirectoryPicker && (
          <p className="mt-4 text-xs text-red-500">
            このブラウザはディレクトリピッカーをサポートしていません。
          </p>
        )}
      </div>
    </div>
  );
}
