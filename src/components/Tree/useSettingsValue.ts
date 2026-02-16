import { useAtomValue } from "jotai";
import { atomSettings } from "../../jotai/atomSettings";

export const useSettingsValue = () => useAtomValue(atomSettings);
