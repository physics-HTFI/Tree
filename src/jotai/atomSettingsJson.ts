import { atom } from "jotai";
import { appFileSystem } from "./utils/appFileSystem";
import { _atomFolders } from "./backings/_atomFolders";

export const atomSettingsJsonValue = atom(async (get) => {
  const folders = get(_atomFolders);
  const settings = await appFileSystem.readAppSettingsAsync(folders?.data);
  if (!settings) return {};
  return settings;
});
