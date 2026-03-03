import { atom } from "jotai";

const atomDataTree = atom<FolderNode | null>(null);
const atomReferenceTree = atom<FolderNode | null>(null);

export const _atomTree = {
  dataTree: atomDataTree,

  referenceTree: atomReferenceTree,

  fullTree: atom((get) => {
    const dataTree = get(atomDataTree);
    const referenceTree = get(atomReferenceTree);
    if (!dataTree || !referenceTree) return null;
    return {
      ...dataTree,
      children: [...dataTree.children, referenceTree],
    };
  }),
};
