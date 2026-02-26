import { atom } from "jotai";
import { _atomAppSettings } from "./backings/_atomAppSettings";

export const atomAppSettingsValue = atom((get) => get(_atomAppSettings));
