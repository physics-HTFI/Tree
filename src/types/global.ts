declare global {
  interface Window {
    showDirectoryPicker?: (options: {
      mode: "read" | "readwrite";
    }) => Promise<FileSystemDirectoryHandle>;
  }
  interface FileSystemDirectoryHandle {
    requestPermission: () => Promise<void>;
  }
}

export {};
