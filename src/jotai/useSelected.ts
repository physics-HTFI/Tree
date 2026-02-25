import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  atomSelectedFolderNode,
  atomSelectedItemNode,
  atomSelectedSvg,
  atomSelectedTreeNodeId,
} from "./share/atomSelected";

const atomUnselect = atom(null, (_, set) => set(atomSelectedTreeNodeId, null));

export const useSelected = {
  useTreeNodeId: () => useAtom(atomSelectedTreeNodeId),
  useSetTreeNodeIdAsync: () => useSetAtom(atomSelectedTreeNodeId),
  useUnselectAsync: () => useSetAtom(atomUnselect),
  useFolderNodeValue: () => useAtomValue(atomSelectedFolderNode),
  useItemNodeValue: () => useAtomValue(atomSelectedItemNode),
  useSvgValue: () => useAtomValue(atomSelectedSvg),
};
