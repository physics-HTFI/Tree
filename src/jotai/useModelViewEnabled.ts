import { useAtom, useAtomValue } from "jotai";
import { atomModelViewEnabled } from "./share/atomModelViewEnabled";

export const useModelViewEnabled = () => useAtom(atomModelViewEnabled);
export const useModelViewEnabledValue = () =>
  useAtomValue(atomModelViewEnabled);
