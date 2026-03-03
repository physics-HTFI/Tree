import { atom } from "jotai";
import { _atomReferenceData } from "./backings/_atomReferenceData";

export const atomReferenceDataValue = atom((get) => get(_atomReferenceData));
