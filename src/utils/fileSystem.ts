export const fileSystem = {
  readTextAsync,
  saveTextAsync,
  renameAsync,
  existsAsync,

  parseJsonAsync,
  saveAsJsonAsync,
};

async function readTextAsync(
  folder: FileSystemDirectoryHandle | null,
  fileName: string,
): Promise<string | null> {
  if (!folder) return null;
  try {
    const fileHandle = await folder.getFileHandle(fileName);
    const file = await fileHandle.getFile();
    return await file.text();
  } catch {
    alert(`ファイルの読み込みに失敗しました: ${fileName}`);
    return null;
  }
}

async function parseJsonAsync<T>(
  folder: FileSystemDirectoryHandle | null,
  fileName: string,
): Promise<T | null> {
  try {
    const text = await readTextAsync(folder, fileName);
    if (!text) return null;
    return JSON.parse(text) as T;
  } catch {
    alert(`JSONファイルが壊れています: ${fileName}`);
    return null;
  }
}

async function saveTextAsync(
  folder: FileSystemDirectoryHandle | null,
  fileName: string,
  text: string,
) {
  if (!folder) return;
  try {
    const fileHandle = await folder.getFileHandle(fileName, {
      create: true,
    });
    const writable = await fileHandle.createWritable();
    await writable.write(text);
    await writable.close();
  } catch {
    alert(`ファイルの保存に失敗しました: ${fileName}`);
    return;
  }
}

async function saveAsJsonAsync<T>(
  folder: FileSystemDirectoryHandle | null,
  fileName: string,
  value: T,
  format?: (json: string) => string,
) {
  if (!folder) return;
  try {
    let json = JSON.stringify(value, null, 2);
    if (format) json = format(json);
    await saveTextAsync(folder, fileName, json);
  } catch {
    alert(`JSONファイルの保存に失敗しました: ${fileName}`);
    return;
  }
}

async function renameAsync(
  folder: FileSystemDirectoryHandle | null,
  oldName: string,
  newName: string,
) {
  if (!folder) return;
  try {
    const text = await readTextAsync(folder, oldName);
    if (text === null) throw new Error();
    await saveTextAsync(folder, newName, text);
    await folder.removeEntry(oldName);
  } catch {
    alert(`ファイルの名前変更に失敗しました: ${oldName} → ${newName}`);
    return;
  }
}

async function existsAsync(
  folder: FileSystemDirectoryHandle | null,
  fileName: string,
) {
  if (!folder) return false;
  try {
    await folder.getFileHandle(fileName);
  } catch {
    return false;
  }
  return true;
}
