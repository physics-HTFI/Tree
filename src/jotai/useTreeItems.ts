import { atom, useAtomValue } from "jotai";
import { _atomAppSettings } from "./share/_atomAppSettings";

const atomGetTreeItems = atom<TreeNode[]>(() => {
  return [
    {
      type: "folder",
      nodeId: "1",
      title: "folder1",
      children: [
        {
          type: "folder",
          nodeId: "2",
          title: "folder2",
          children: [
            {
              type: "file",
              nodeId: "9",
              title: "title1",
              tier: 1,
              hasTicks: true,
              key: 1,
            },
            {
              type: "file",
              nodeId: "10",
              title: "title2",
              tier: 2,
              hasTicks: false,
              key: 2,
            },
          ],
        },
        {
          type: "file",
          nodeId: "3",
          title: "tier0",
          tier: 0,
          hasTicks: false,
          key: 1,
        },
        {
          type: "file",
          nodeId: "4",
          title: "tier1",
          tier: 1,
          hasTicks: false,
          key: 2,
        },
        {
          type: "file",
          nodeId: "5",
          title: "tier2",
          tier: 2,
          hasTicks: false,
          key: 3,
        },
        {
          type: "file",
          nodeId: "6",
          title: "tier3",
          tier: 3,
          hasTicks: false,
          key: 4,
        },
        {
          type: "file",
          nodeId: "7",
          title: "tier4",
          tier: 4,
          hasTicks: false,
          key: 5,
        },
        {
          type: "file",
          nodeId: "8",
          title: "tier5",
          tier: 5,
          hasTicks: false,
          key: 6,
        },
      ],
    },
  ] satisfies TreeNode[];
});

const atomFilteredTreeItems = atom<TreeNode[]>((get) => {
  const tree = structuredClone(get(atomGetTreeItems));
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

export const useTreeItemsValue = () => useAtomValue(atomGetTreeItems);
export const useFilteredTreeItemsValue = () =>
  useAtomValue(atomFilteredTreeItems);
