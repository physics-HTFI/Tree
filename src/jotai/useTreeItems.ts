import { atom, useAtomValue } from "jotai";
import { _atomAppSettings } from "./share/_atomAppSettings";
import { _atomGetTreeItems } from "./share/_atomTreeItems";

const atomFilteredTreeItems = atom<FolderNode | null>((get) => {
  const tree = structuredClone(get(_atomGetTreeItems));
  if (!tree) return null;

  const ignoredTiers =
    get(_atomAppSettings)
      .tiers?.map((tier, i) => (tier.checked ? -1 : i))
      ?.filter((i) => i !== -1) ?? [];

  const filterTree = (items: FolderNode): FolderNode => {
    const children: TreeNode[] = [];
    for (const item of items.children) {
      if (item.type === "folder") {
        children.push(filterTree(item));
      } else {
        if (ignoredTiers.includes(item.data.tier ?? 0)) continue; // チェックが外れているティアは表示しない
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
