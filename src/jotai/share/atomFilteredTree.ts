import { atom } from "jotai";
import { _atomTreeItems } from "./backings/_atomTreeItems";
import { atomHiddenTiers } from "./atomHiddenTiers";

export const atomFilteredTreeValue = atom<FolderNode | null>((get) => {
  const tree = structuredClone(get(_atomTreeItems));
  const hiddenTiers = get(atomHiddenTiers);
  if (!tree) return null;

  const filterTree = (items: FolderNode): FolderNode => {
    const children: TreeNode[] = [];
    for (const item of items.children) {
      if (item.type === "folder") {
        const filteredChild = filterTree(item);
        if (filteredChild.children.length === 0 && hiddenTiers.has(0)) continue;
        children.push(filteredChild);
      } else {
        if (hiddenTiers.has(item.entry.tier ?? 0)) continue; // チェックが外れているティアは表示しない
        children.push(item);
      }
    }
    return { ...items, children };
  };

  return filterTree(tree);
});
