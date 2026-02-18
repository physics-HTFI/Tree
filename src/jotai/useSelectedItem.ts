import { atom, useAtom, useAtomValue } from "jotai";
import { _atomSelectedItemId } from "./share/_atomSelectedItemId";

export const useSelectedItemId = () => useAtom(_atomSelectedItemId);
export const useSelectedItemIdValue = () => useAtomValue(_atomSelectedItemId);

const items: Record<string, FolderSettings | FileSettings> = {
  "1": {},
  "2": {},
  "3": { tier: 0 },
  "4": { tier: 1 },
  "5": { tier: 2 },
  "6": { tier: 3 },
  "7": { tier: 4 },
  "8": { tier: 5 },
  "9": {
    path: "id1",
    time: 1,
    start: 1,
    ticks: 1,
    key: 1,
    tier: 1,
    selected: false,
    notes: "note1",
  },
  "10": {
    path: "id2",
    time: 2,
    start: 2,
    ticks: 2,
    key: 2,
    tier: 2,
    selected: false,
    notes: "note2",
  },
};

const atomSelectedItem = atom((get) => {
  const selectedItemId = get(_atomSelectedItemId);
  if (!selectedItemId) return null;
  return items[selectedItemId] ?? null;
});

export const useSelectedItemValue = () => useAtomValue(atomSelectedItem);
