import { atom } from "jotai";

export const atomHiddenTiers = atom<Set<number>>(new Set<number>());
