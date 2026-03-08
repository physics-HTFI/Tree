import { atom } from "jotai";

const atomDataTree = atom<FolderNode>();
const atomReferenceTree = atom<FolderNode>();

export const _atomTree = {
  dataTree: atomDataTree,

  referenceTree: atomReferenceTree,

  fullTree: atom((get) => {
    const dataTree = get(atomDataTree);
    const referenceTree = get(atomReferenceTree);
    if (!dataTree || !referenceTree) return undefined;
    return {
      ...dataTree,
      children: [...dataTree.children, referenceTree],
    };
  }),
};
