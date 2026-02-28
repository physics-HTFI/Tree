import { base64 } from "@/generics/utils/base64";

const HEADER_SVG = "data:image/svg+xml;base64,";
const HEADER_MP3 = "data:audio/mpeg;base64,"; // audio/mp3 も使えるが正式なMIMEタイプは audio/mpeg

export const itemBase64 = {
  readSvgFromFileAsync,
  readMp3FromFileAsync,

  readSvgAsync: async (itemNode?: ItemNode) => {
    const folder = itemNode?.parent?.handle;
    const title = itemNode?.entry?.title;
    return readSvgFromFileAsync(folder, title + ".svg");
  },

  saveSvgAsync: async (itemNode?: ItemNode, base64str?: string) => {
    const handle = itemNode?.parent?.handle;
    const title = itemNode?.entry?.title;
    if (!handle || title === undefined || !base64str) {
      alert("SVGファイルを保存できません");
      return false;
    }
    const isOk = await base64.saveTextAsBase64Async(
      handle,
      title + ".svg",
      base64str.replace(HEADER_SVG, ""),
    );
    if (!isOk) {
      alert("SVGファイルの保存に失敗しました");
      return false;
    }
    return true;
  },
};

async function readSvgFromFileAsync(
  folder?: FileSystemDirectoryHandle | null,
  fileName?: string,
) {
  if (!folder || fileName === undefined) return null;
  if (!fileName.toLocaleLowerCase().endsWith(".svg")) return null;
  const svg = await base64.readTextAsBase64Async(folder, fileName);
  return svg ? HEADER_SVG + svg : null;
}

async function readMp3FromFileAsync(
  folder?: FileSystemDirectoryHandle | null,
  fileName?: string,
) {
  if (!folder || fileName === undefined) return null;
  if (!fileName.toLocaleLowerCase().endsWith(".mp3")) return null;
  const mp3 = await base64.readBinaryAsBase64Async(folder, fileName);
  return mp3 ? HEADER_MP3 + mp3 : null;
}
