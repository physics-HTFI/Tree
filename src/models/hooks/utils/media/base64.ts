import { base64 } from "@/generics/utils/base64";
import type { FolderNode, ItemNode } from "@/types/TreeNode";

const HEADER_SVG = "data:image/svg+xml;base64,";
const HEADER_MP3 = "data:audio/mpeg;base64,"; // audio/mp3 も使えるが正式なMIMEタイプは audio/mpeg

export async function readSvgAsync(itemNode?: ItemNode) {
  const folder = itemNode?.parent?.handle;
  const title = itemNode?.entry?.title;
  return readSvgFromFileAsync(folder, title + ".svg");
}

export async function readSvgFromFileAsync(
  folder?: FileSystemDirectoryHandle,
  fileName?: string,
) {
  if (!folder || fileName === undefined) return undefined;
  if (!fileName.toLocaleLowerCase().endsWith(".svg")) return undefined;
  const svg = await base64.readTextAsBase64Async(folder, fileName);
  return svg ? HEADER_SVG + svg : undefined;
}

export async function saveSvgAsync(itemNode?: ItemNode, base64str?: string) {
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

export async function readMp3Async(referenceTree?: FolderNode, path?: string) {
  if (!path || !referenceTree) return undefined;

  const split = path.split("/");
  let current = referenceTree;
  for (let i = 0; i < split.length - 1; i++) {
    const name = split[i];
    const next = current?.children.find(
      (child) => child.type === "folder" && child.title === name,
    );
    if (!next || next.type !== "folder") return undefined;
    current = next;
  }

  const handle = current.handle;
  const name = split.at(-1);
  return await readMp3AsyncFromFile(handle, name);
}

async function readMp3AsyncFromFile(
  folder?: FileSystemDirectoryHandle,
  fileName?: string,
) {
  if (!folder || fileName === undefined) return undefined;
  if (!fileName.toLocaleLowerCase().endsWith(".mp3")) return undefined;
  const mp3 = await base64.readBinaryAsBase64Async(folder, fileName);
  return mp3 ? HEADER_MP3 + mp3 : undefined;
}
