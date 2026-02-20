import { useAtomValue } from "jotai";
import { _atomAppSettings } from "./share/_atomAppSettings";

export const useAppSettingsValue = () => useAtomValue(_atomAppSettings);
