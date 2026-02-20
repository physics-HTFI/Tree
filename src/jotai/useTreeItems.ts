import { atom, useAtomValue } from "jotai";
import { _atomGetTreeItems } from "./share/_atomTreeItems";
import { _atomHiddenTiers } from "./share/_atomHiddenTiers";

const atomFilteredTreeItems = atom<FolderNode | null>((get) => {
  const tree = structuredClone(get(_atomGetTreeItems));
  const hiddenTiers = get(_atomHiddenTiers);
  if (!tree) return null;

  const filterTree = (items: FolderNode): FolderNode => {
    const children: TreeNode[] = [];
    for (const item of items.children) {
      if (item.type === "folder") {
        const filteredChild = filterTree(item);
        if (filteredChild.children.length === 0 && hiddenTiers.has(0)) continue;
        children.push(filteredChild);
      } else {
        if (hiddenTiers.has(item.data.tier ?? 0)) continue; // チェックが外れているティアは表示しない
        children.push(item);
      }
    }
    return { ...items, children };
  };

  return filterTree(tree);
});

export const useTreeItemsValue = () => useAtomValue(_atomGetTreeItems);
export const useFilteredTreeItemsValue = () =>
  useAtomValue(atomFilteredTreeItems);
