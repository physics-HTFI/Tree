import { atom, useAtomValue } from "jotai";
import { _atomAppSettings } from "./share/_atomAppSettings";
import { _atomGetTreeItems } from "./share/_atomTreeItems";

const atomFilteredTreeItems = atom<TreeNode[]>((get) => {
  const tree = structuredClone(get(_atomGetTreeItems));
  const ignoredTiers =
    get(_atomAppSettings)
      .tiers?.map((tier, i) => (tier.checked ? -1 : i))
      ?.filter((i) => i !== -1) ?? [];

  const filterTree = (items: TreeNode[]): TreeNode[] => {
    for (const item of items) {
      if (item.type === "folder") {
        item.children = filterTree(item.children);
      }
    }
    return items.filter((item) => {
      if (item.type === "folder") return true; // フォルダは常に表示する
      if (ignoredTiers.includes(item.tier)) return false; // チェックが外れているティアは表示しない
      return true;
    });
  };

  return filterTree(tree);
});

export const useTreeItemsValue = () => useAtomValue(_atomGetTreeItems);
export const useFilteredTreeItemsValue = () =>
  useAtomValue(atomFilteredTreeItems);
