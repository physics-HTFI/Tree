export const fileSystem = {
  parseAsync: async function <T>(
    folder: FileSystemDirectoryHandle | null,
    fileName: string,
  ): Promise<T | null> {
    if (!folder) return null;
    try {
      const fileHandle = await folder.getFileHandle(fileName);
      const file = await fileHandle.getFile();
      return JSON.parse(await file.text()) as T;
    } catch {
      return null;
    }
  },

  saveAsync: async function <T>(
    folder: FileSystemDirectoryHandle | null,
    fileName: string,
    value: T,
  ) {
    if (!folder) return;
    try {
      const json = JSON.stringify(value, null, 2);
      const fileHandle = await folder.getFileHandle(fileName, {
        create: true,
      });
      const writable = await fileHandle.createWritable();
      await writable.write(json);
      await writable.close();
    } catch {
      return;
    }
  },
};
