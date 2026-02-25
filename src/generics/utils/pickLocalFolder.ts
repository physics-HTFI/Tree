/**
 * ブラウザのディレクトリピッカーを使ってローカルのフォルダーを選択する関数。
 * キャンセル時や、ブラウザがこの機能をサポートしていない場合はnullを返す。
 */
export const pickLocalFolderAsync: () => Promise<FileSystemDirectoryHandle | null> =
  async () => {
    if (!window.showDirectoryPicker) return null;
    try {
      const handle = await window.showDirectoryPicker();
      return handle;
    } catch {
      // user aborted or error; do nothing
      return null;
    }
  };
