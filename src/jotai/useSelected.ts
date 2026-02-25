import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  atomSelectedFolderNode,
  atomSelectedItemNode,
  atomSelectedSvg,
  atomSelectedTreeNodeId,
  atomUnselect,
} from "./share/atomSelected";

export const useSelected = {
  useTreeNodeId: () => useAtom(atomSelectedTreeNodeId),
  useSetTreeNodeIdAsync: () => useSetAtom(atomSelectedTreeNodeId),
  useUnselectAsync: () => useSetAtom(atomUnselect),
  useFolderNodeValue: () => useAtomValue(atomSelectedFolderNode),
  useItemNodeValue: () => useAtomValue(atomSelectedItemNode),
  useSvgValue: () => useAtomValue(atomSelectedSvg),
};
