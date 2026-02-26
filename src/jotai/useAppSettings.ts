import { useAtomValue } from "jotai";
import { atomAppSettingsValue } from "./share/atomAppSettings";

export const useAppSettingsValue = () => useAtomValue(atomAppSettingsValue);
