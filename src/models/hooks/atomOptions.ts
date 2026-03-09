import { atom } from "jotai";

const atomHiddenTiers = atom<Set<number>>(new Set<number>());
const atomModelViewEnabled = atom(true);

export const atomOptions = {
  hiddenTiers: atomHiddenTiers,
  modelViewEnabled: atomModelViewEnabled,
};
