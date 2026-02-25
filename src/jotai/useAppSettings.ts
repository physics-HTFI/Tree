import { useAtomValue } from "jotai";
import { atomAppSettings } from "./share/atomAppSettings";

export const useAppSettingsValue = () => useAtomValue(atomAppSettings);
