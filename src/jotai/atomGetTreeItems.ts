import { atom } from "jotai";

export const atomGetTreeItems = atom<TreeNode[]>(() => {
  return [
    {
      type: "folder",
      nodeId: "1",
      title: "folder1",
      children: [
        { type: "folder", nodeId: "2", title: "folder2", children: [] },
        { type: "file", nodeId: "3", title: "tier0", tier: 0 },
        { type: "file", nodeId: "4", title: "tier1", tier: 1 },
        { type: "file", nodeId: "5", title: "tier2", tier: 2 },
        { type: "file", nodeId: "6", title: "tier3", tier: 3 },
        { type: "file", nodeId: "7", title: "tier4", tier: 4 },
        { type: "file", nodeId: "8", title: "tier5", tier: 5 },
      ],
    },
    {
      type: "file",
      nodeId: "9",
      title: "title1",
      path: "id1",
      time: 1,
      start: 1,
      ticks: 1,
      key: 1,
      tier: 1,
      selected: false,
      notes: "note1",
    },
    {
      type: "file",
      title: "title2",
      nodeId: "10",
      path: "id2",
      time: 2,
      start: 2,
      ticks: 2,
      key: 2,
      tier: 2,
      selected: false,
      notes: "note2",
    },
  ];
});
