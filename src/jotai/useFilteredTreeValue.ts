import { useAtomValue } from "jotai";
import { atomFilteredTreeValue } from "./share/atomFIlteredTree";

export const useFilteredTreeValue = () => useAtomValue(atomFilteredTreeValue);
