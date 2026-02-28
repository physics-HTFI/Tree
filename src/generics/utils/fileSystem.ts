export const fileSystem = {
  readTextAsync,
  saveTextAsync,
  renameAsync,
  existsAsync,

  readBinaryAsync,

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
    return null;
  }
}

async function readBinaryAsync(
  folder: FileSystemDirectoryHandle | null,
  fileName: string,
): Promise<ArrayBuffer | null> {
  if (!folder) return null;
  try {
    const fileHandle = await folder.getFileHandle(fileName);
    const file = await fileHandle.getFile();
    return await file.arrayBuffer();
  } catch {
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
    return null;
  }
}

async function saveTextAsync(
  folder: FileSystemDirectoryHandle | null,
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
  folder: FileSystemDirectoryHandle | null,
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
  folder: FileSystemDirectoryHandle | null,
  oldName: string,
  newName: string,
) {
  if (!folder) return false;
  try {
    const text = await readTextAsync(folder, oldName);
    if (text === null) return false;
    await saveTextAsync(folder, newName, text);
    await folder.removeEntry(oldName);
    return true;
  } catch {
    return false;
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
