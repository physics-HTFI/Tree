import { useAtom } from "jotai";
import { _atomHiddenTiers } from "./share/_atomHiddenTiers";

export const useHiddenTiers = () => useAtom(_atomHiddenTiers);
