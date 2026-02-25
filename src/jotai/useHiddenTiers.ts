import { useAtom, useAtomValue } from "jotai";
import { atomHiddenTiers } from "./share/atomHiddenTiers";

export const useHiddenTiers = () => useAtom(atomHiddenTiers);
export const useHiddenTiersValue = () => useAtomValue(atomHiddenTiers);
