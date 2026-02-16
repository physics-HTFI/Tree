import { useAtomValue } from "jotai";
import { atomGetTreeItems } from "../../jotai/atomGetTreeItems";

export const useTreeItems = () => useAtomValue(atomGetTreeItems);
