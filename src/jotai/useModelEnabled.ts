import { useAtom, useAtomValue } from "jotai";
import { atomModelEnabled } from "./share/_atomModelEnabled";

export const useModelEnabled = () => useAtom(atomModelEnabled);
export const useModelEnabledValue = () => useAtomValue(atomModelEnabled);
