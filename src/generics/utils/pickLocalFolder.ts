/**
 * ブラウザのディレクトリピッカーを使ってローカルのフォルダーを選択する関数。
 * キャンセル時や、ブラウザがこの機能をサポートしていない場合はnullを返す。
 */
export const pickLocalFolderAsync: (
  mode: "read" | "readwrite",
) => Promise<FileSystemDirectoryHandle | undefined> = async (mode) => {
  if (!window.showDirectoryPicker) return undefined;
  try {
    const handle = await window.showDirectoryPicker({ mode });
    return handle;
  } catch {
    // user aborted or error; do nothing
    return undefined;
  }
};
