import { fileSystem } from "./fileSystem";

export const base64 = {
  readTextAsBase64Async,
  readBinaryAsBase64Async,

  saveTextAsBase64Async,
};

async function readTextAsBase64Async(
  folder?: FileSystemDirectoryHandle,
  fileName?: string,
) {
  if (!folder || !fileName) return null;
  const text = await fileSystem.readTextAsync(folder, fileName);
  if (!text) return null;
  return utf8ToBase64(text);
}

async function readBinaryAsBase64Async(
  folder?: FileSystemDirectoryHandle,
  fileName?: string,
) {
  if (!folder || !fileName) return null;
  const arrayBuffer = await fileSystem.readBinaryAsync(folder, fileName);
  if (!arrayBuffer) return null;
  const bytes = new Uint8Array(arrayBuffer);
  const bin = Array.from(bytes, (b) => String.fromCharCode(b)).join("");
  return btoa(bin);
}

async function saveTextAsBase64Async(
  folder?: FileSystemDirectoryHandle,
  fileName?: string,
  base64?: string,
) {
  if (!folder || !fileName || !base64) return false;
  const text = base64ToUtf8(base64);
  return await fileSystem.saveTextAsync(folder, fileName, text);
}

function utf8ToBase64(str: string) {
  const bytes = new TextEncoder().encode(str);
  const bin = Array.from(bytes, (b) => String.fromCharCode(b)).join("");
  return btoa(bin);
}

function base64ToUtf8(base64: string) {
  const bin = atob(base64);
  const bytes = new Uint8Array(Array.from(bin, (char) => char.charCodeAt(0)));
  return new TextDecoder().decode(bytes);
}
