import { useAtomValue } from "jotai";
import { atomSettings } from "../../jotai/atomFolder";

export const useSettingsValue = () => useAtomValue(atomSettings);
