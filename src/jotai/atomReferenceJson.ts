import { atom } from "jotai";
import { _atomReferenceJson } from "./backings/_atomReferenceJson";

export const atomReferenceJsonValue = atom((get) => get(_atomReferenceJson));
