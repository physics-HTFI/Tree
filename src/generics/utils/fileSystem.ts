export const fileSystem = {
  readTextAsync,
  saveTextAsync,
  renameAsync,
  moveAsync,
  existsAsync,

  readBinaryAsync,

  parseJsonAsync,
  saveAsJsonAsync,
};

async function readTextAsync(
  folder: FileSystemDirectoryHandle | undefined,
  fileName: string,
): Promise<string | undefined> {
  if (!folder) return undefined;
  try {
    const fileHandle = await folder.getFileHandle(fileName);
    const file = await fileHandle.getFile();
    return await file.text();
  } catch {
    return undefined;
  }
}

async function readBinaryAsync(
  folder: FileSystemDirectoryHandle | undefined,
  fileName: string,
): Promise<ArrayBuffer | undefined> {
  if (!folder) return undefined;
  try {
    const fileHandle = await folder.getFileHandle(fileName);
    const file = await fileHandle.getFile();
    return await file.arrayBuffer();
  } catch {
    return undefined;
  }
}

async function parseJsonAsync<T>(
  folder: FileSystemDirectoryHandle | undefined,
  fileName: string,
): Promise<T | undefined> {
  try {
    const text = await readTextAsync(folder, fileName);
    if (!text) return undefined;
    return JSON.parse(text) as T;
  } catch {
    return undefined;
  }
}

async function saveTextAsync(
  folder: FileSystemDirectoryHandle | undefined,
  fileName: string,
  text: string,
) {
  if (!folder) return false;
  try {
    const fileHandle = await folder.getFileHandle(fileName, {
      create: true,
    });
    const writable = await fileHandle.createWritable();
    await writable.write(text);
    await writable.close();
    return true;
  } catch {
    return false;
  }
}

async function saveAsJsonAsync<T>(
  folder: FileSystemDirectoryHandle | undefined,
  fileName: string,
  value: T,
  format?: (json: string) => string,
) {
  if (!folder) return false;
  try {
    let json = JSON.stringify(value, null, 2);
    if (format) json = format(json);
    await saveTextAsync(folder, fileName, json);
    return true;
  } catch {
    return false;
  }
}

async function renameAsync(
  folder: FileSystemDirectoryHandle | undefined,
  oldName: string,
  newName: string,
) {
  return await moveAsync(folder, oldName, folder, newName);
}

async function moveAsync(
  oldFolder: FileSystemDirectoryHandle | undefined,
  oldName: string,
  newFolder: FileSystemDirectoryHandle | undefined,
  newName: string,
) {
  if (!oldFolder || !newFolder) return false;
  if (await existsAsync(newFolder, newName)) return false;
  try {
    const text = await readTextAsync(oldFolder, oldName);
    if (text === undefined) return false;
    await saveTextAsync(newFolder, newName, text);
    await oldFolder.removeEntry(oldName);
    return true;
  } catch {
    return false;
  }
}

async function existsAsync(
  folder: FileSystemDirectoryHandle | undefined,
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
