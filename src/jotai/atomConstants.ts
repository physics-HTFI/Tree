import { atom } from "jotai";
import { appFileSystem } from "./utils/appFileSystem";
import { _atomFolders } from "./backings/_atomFolders";

const atomDefaultSvgBase64Value = atom(async (get) => {
  const folders = get(_atomFolders);
  const svg = await appFileSystem.readDefaultSvgBase64Async(folders?.data);
  if (!svg) return undefined;
  return svg;
});

const atomSettingsJsonValue = atom(async (get) => {
  const folders = get(_atomFolders);
  const settings = await appFileSystem.readSettingsJsonAsync(folders?.data);
  if (!settings) return undefined;
  return settings;
});

export const atomConstants = {
  defaultSvgBase64Value: atomDefaultSvgBase64Value,
  settingsJsonValue: atomSettingsJsonValue,
};
