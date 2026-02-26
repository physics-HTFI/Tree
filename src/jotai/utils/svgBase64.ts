import { base64 } from "@/generics/utils/base64";

const HEADER = "data:image/svg+xml;base64,";

export const svgBase64 = {
  readFromFileAsync,

  readAsync: async (itemNode?: ItemNode) => {
    const folder = itemNode?.parent?.handle;
    const title = itemNode?.entry?.title;
    return readFromFileAsync(folder, title + ".svg");
  },

  saveAsync: async (itemNode?: ItemNode, base64str?: string) => {
    const handle = itemNode?.parent?.handle;
    const title = itemNode?.entry?.title;
    if (!handle || title === undefined || !base64str) {
      alert("SVGファイルを保存できません");
      return false;
    }
    const isOk = await base64.saveBase64Async(
      handle,
      title + ".svg",
      base64str.replace(HEADER, ""),
    );
    if (!isOk) {
      alert("SVGファイルの保存に失敗しました");
      return false;
    }
    return true;
  },
};

async function readFromFileAsync(
  folder?: FileSystemDirectoryHandle | null,
  fileName?: string,
) {
  if (!folder || fileName === undefined) return null;
  const svg = await base64.readBase64Async(folder, fileName);
  return svg ? HEADER + svg : null;
}
