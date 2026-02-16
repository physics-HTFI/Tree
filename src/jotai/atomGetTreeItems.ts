import { atom } from "jotai";

export const atomGetTreeItems = atom(() => {
  return [
    {
      title: "folder1",
      children: [
        { title: "folder2", children: [] },
        { title: "tier0", tier: 0 },
        { title: "tier1", tier: 1 },
        { title: "tier2", tier: 2 },
        { title: "tier3", tier: 3 },
        { title: "tier4", tier: 4 },
        { title: "tier5", tier: 5 },
      ],
    },
    {
      title: "title1",
      id: "id1",
      time: 1,
      start: 1,
      ticks: 1,
      key: 1,
      tier: 1,
      selected: false,
      notes: "note1",
    },
    {
      title: "title2",
      id: "id2",
      time: 2,
      start: 2,
      ticks: 2,
      key: 2,
      tier: 2,
      selected: false,
      notes: "note2",
    },
  ] satisfies TreeNode[];
});
