import { useAtom } from "jotai";
import { atomSettings } from "../../jotai/atomFolder";

export const useSettings = () => useAtom(atomSettings);
