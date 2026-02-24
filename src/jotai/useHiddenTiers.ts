import { useAtom, useAtomValue } from "jotai";
import { _atomHiddenTiers } from "./share/_atomHiddenTiers";

export const useHiddenTiers = () => useAtom(_atomHiddenTiers);
export const useHiddenTiersValue = () => useAtomValue(_atomHiddenTiers);
