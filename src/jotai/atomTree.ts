import { atom } from "jotai";
import { _atomTree } from "./backings/_atomTree";
import { atomOptions } from "./atomOptions";

const atomFilteredTreeValue = atom<Promise<FolderNode | undefined>>(
  async (get) => {
    const tree = await get(_atomTree.fullTreeValue);
    const hiddenTiers = get(atomOptions.hiddenTiers);
    if (!tree) return undefined;
    return filterTree(tree, hiddenTiers);
  },
);

function filterTree(folder: FolderNode, hiddenTiers: Set<number>): FolderNode {
  const children: TreeNode[] = [];
  for (const item of folder.children) {
    if (item.type === "folder") {
      const filteredChild = filterTree(item, hiddenTiers);
      if (filteredChild.children.length === 0 && hiddenTiers.has(0)) continue;
      children.push(filteredChild);
    } else {
      if (hiddenTiers.has(item.entry.tier ?? 0)) continue;
      children.push(item);
    }
  }
  return { ...folder, children };
}

export const atomTree = {
  referenceTreeValue: atom((get) => get(_atomTree.referenceTreeValue)),
  filteredTreeValue: atomFilteredTreeValue,
};
