import { atom } from "jotai";
import { _atomReferenceJson } from "./backings/_atomReferenceJson";
import { appFileSystem } from "./utils/appFileSystem";
import { _atomFolders } from "./backings/_atomFolders";

const atomReferenceJsonValue = atom((get) => get(_atomReferenceJson));

const atomSetReferencePathAsync = atom(
  null,
  async (get, set, path: string, type: "add" | "remove") => {
    const data = get(atomReferenceJsonValue);
    const folder = get(_atomFolders)?.data;
    if (!folder) return;

    data.highlighted_paths = data.highlighted_paths.filter((p) => p !== path);
    if (type === "add") data.highlighted_paths.push(path);
    data.highlighted_paths.sort();

    set(_atomReferenceJson, { ...data });
    await appFileSystem.saveReferenceJsonAsync(folder, data);
  },
);

export const atomReferenceJson = {
  value: atomReferenceJsonValue,
  setPathAsync: atomSetReferencePathAsync,
};
