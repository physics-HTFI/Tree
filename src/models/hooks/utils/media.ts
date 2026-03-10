import { base64 } from "@/generics/utils/base64";
import { fileSystem } from "@/generics/utils/fileSystem";

const HEADER_SVG = "data:image/svg+xml;base64,";
const HEADER_MP3 = "data:audio/mpeg;base64,"; // audio/mp3 も使えるが正式なMIMEタイプは audio/mpeg

export const media = {
  base64: {
    readMp3Async,

    readSvgFromFileAsync,
    readSvgAsync,
    saveSvgAsync,
  },

  moveSvgFileAsync,
};

async function readSvgAsync(itemNode?: ItemNode) {
  const folder = itemNode?.parent?.handle;
  const title = itemNode?.entry?.title;
  return readSvgFromFileAsync(folder, title + ".svg");
}

async function saveSvgAsync(itemNode?: ItemNode, base64str?: string) {
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
}

async function readSvgFromFileAsync(
  folder?: FileSystemDirectoryHandle,
  fileName?: string,
) {
  if (!folder || fileName === undefined) return undefined;
  if (!fileName.toLocaleLowerCase().endsWith(".svg")) return undefined;
  const svg = await base64.readTextAsBase64Async(folder, fileName);
  return svg ? HEADER_SVG + svg : undefined;
}

async function readMp3Async(
  folder?: FileSystemDirectoryHandle,
  fileName?: string,
) {
  if (!folder || fileName === undefined) return undefined;
  if (!fileName.toLocaleLowerCase().endsWith(".mp3")) return undefined;
  const mp3 = await base64.readBinaryAsBase64Async(folder, fileName);
  return mp3 ? HEADER_MP3 + mp3 : undefined;
}

async function moveSvgFileAsync(
  parentHandle: FileSystemDirectoryHandle,
  oldItem: ItemNode,
  newItem: ItemEntry,
) {
  if (!oldItem.hasSvg) return true;
  const titleChanged =
    oldItem.entry.title !== undefined &&
    newItem.title !== undefined &&
    oldItem.entry.title !== newItem.title;
  if (!titleChanged) return true;

  const oldFileName = oldItem.entry.title + ".svg";
  const newFileName = newItem.title + ".svg";
  const isOk = await fileSystem.renameAsync(
    parentHandle,
    oldFileName,
    newFileName,
  );
  if (!isOk) alert("SVGファイルの名前変更に失敗しました");
  return isOk;
}
