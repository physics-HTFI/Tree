import { atom } from "jotai";
import { appFileSystem } from "./utils/appFileSystem";
import { _atomFolders } from "./backings/_atomFolders";

export const atomDefaultSvgBase64Value = atom(async (get) => {
  const folders = get(_atomFolders);
  const svg = await appFileSystem.readDefaultSvgBase64Async(folders?.data);
  if (!svg) return undefined;
  return svg;
});
