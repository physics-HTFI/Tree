import { pickLocalFolder } from "./pickLocalFolder";

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

  const pick = async () => {
    const handle = await pickLocalFolder();
    if (!handle) return;
    onSelect(handle);
  };

  const pickLastUsed = () => {
    if (!lastUsedFolder) return;
    onSelect(lastUsedFolder);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg shadow-lg w-11/12 max-w-md p-6 z-10">
        <h2 className="text-lg font-semibold mb-4">フォルダーを選択</h2>
        <div className="flex gap-3">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={pick}
          >
            フォルダーを選択
          </button>
          {lastUsedFolder && (
            <button
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-md hover:bg-gray-300"
              onClick={pickLastUsed}
            >
              前回使用されたフォルダー: {lastUsedFolder.name}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
