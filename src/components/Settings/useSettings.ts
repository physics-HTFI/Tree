import { useAtom } from "jotai";
import { atomSettings } from "../../jotai/atomSettings";

export const useSettings = () => useAtom(atomSettings);
