import { fileSystem } from "./fileSystem";

export const base64 = {
  readBase64Async,
  saveBase64Async,
};

async function readBase64Async(
  folder?: FileSystemDirectoryHandle,
  fileName?: string,
) {
  if (!folder || !fileName) return null;
  const svgText = await fileSystem.readTextAsync(folder, fileName);
  if (!svgText) return null;
  return utf8ToBase64(svgText);
}

async function saveBase64Async(
  folder?: FileSystemDirectoryHandle,
  fileName?: string,
  base64?: string,
) {
  if (!folder || !fileName || !base64) return;
  const svgText = base64ToUtf8(base64);
  const isOk = await fileSystem.saveTextAsync(folder, fileName, svgText);
  if (!isOk) alert("SVGファイルの保存に失敗しました");
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
