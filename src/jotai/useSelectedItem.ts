import { atom, useAtom, useAtomValue } from "jotai";
import { _atomSelectedItemId } from "./share/_atomSelectedItemId";

export const useSelectedItemId = () => useAtom(_atomSelectedItemId);
export const useSelectedItemIdValue = () => useAtomValue(_atomSelectedItemId);

const items: Record<
  string,
  { type: "folder"; item: FolderData } | { type: "file"; item: ItemData }
> = {
  "1": { type: "folder", item: {} },
  "2": { type: "folder", item: {} },
  "3": { type: "file", item: { tier: 0 } },
  "4": { type: "file", item: { tier: 1 } },
  "5": { type: "file", item: { tier: 2 } },
  "6": { type: "file", item: { tier: 3 } },
  "7": { type: "file", item: { tier: 4 } },
  "8": { type: "file", item: { tier: 5 } },
  "9": {
    type: "file",
    item: {
      path: "path1",
      time: 1,
      start: 1,
      ticks: 1,
      key: 1,
      tier: 1,
      highlighted: false,
      notes: "note1",
    },
  },
  "10": {
    type: "file",
    item: {
      path: "path2",
      time: 2,
      start: 2,
      ticks: 2,
      key: 2,
      tier: 2,
      highlighted: false,
      notes: "note2",
    },
  },
};

const atomSelectedFolderSettings = atom((get) => {
  const selectedItemId = get(_atomSelectedItemId);
  if (!selectedItemId || items[selectedItemId]?.type !== "folder") return null;
  return items[selectedItemId].item;
});

const atomSelectedFileSettings = atom((get) => {
  const selectedItemId = get(_atomSelectedItemId);
  if (!selectedItemId || items[selectedItemId]?.type !== "file") return null;
  return items[selectedItemId].item;
});

export const useSelectedFolderSettingsValue = () =>
  useAtomValue(atomSelectedFolderSettings);
export const useSelectedFileSettingsValue = () =>
  useAtomValue(atomSelectedFileSettings);
