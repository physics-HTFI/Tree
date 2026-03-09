import { atom } from "jotai";
import { _atomFolders } from "./_atomFolders";
import { createTreeItems } from "../utils/createTreeItems";

const atomDataTree = atom<FolderNode>();

const atomReferenceTreeValue = atom<Promise<FolderNode>>(async (get) => {
  const reference = get(_atomFolders)?.reference;
  return await createTreeItems.fromReferenceFolder(reference);
});

const atomFullTreeValue = atom<Promise<FolderNode | undefined>>(async (get) => {
  const dataTree = get(atomDataTree);
  const referenceTree = await get(atomReferenceTreeValue);
  if (!dataTree || !referenceTree) return undefined;
  return {
    ...dataTree,
    children: [...dataTree.children, referenceTree],
  };
});

export const _atomTree = {
  dataTree: atomDataTree,
  referenceTreeValue: atomReferenceTreeValue,
  fullTreeValue: atomFullTreeValue,
};
