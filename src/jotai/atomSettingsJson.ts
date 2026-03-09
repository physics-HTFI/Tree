import { atom } from "jotai";
import { appFileSystem } from "./utils/appFileSystem";
import { _atomFolders } from "./backings/_atomFolders";

export const atomSettingsJsonValue = atom(async (get) => {
  const folders = get(_atomFolders);
  const settings = await appFileSystem.readSettingsJsonAsync(folders?.data);
  if (!settings) return undefined;
  return settings;
});
