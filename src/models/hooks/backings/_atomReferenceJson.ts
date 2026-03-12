import type { ReferenceJson } from "@/types/ReferenceJson";
import { atom } from "jotai";

export const _atomReferenceJson = atom<ReferenceJson>({
  highlighted_paths: [],
});
