import { useAtom, useAtomValue } from "jotai";
import { _atomSelectedItemId } from "./share/_atomSelectedItemId";

export const useSelectedItemId = () => useAtom(_atomSelectedItemId);
export const useSelectedItemIdValue = () => useAtomValue(_atomSelectedItemId);
