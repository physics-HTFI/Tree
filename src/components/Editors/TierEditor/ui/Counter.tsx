import { Typography } from "@mui/material";
import { atomFilteredTreeValue } from "../../../../jotai/share/atomFilteredTree";
import { useAtomValue } from "jotai";

export function Counter() {
  const filteredTreeItems = useAtomValue(atomFilteredTreeValue);
  const count = countFiles(filteredTreeItems);

  return (
    <Typography variant="h5" sx={{ mr: 3 }}>
      {count}
    </Typography>
  );
}

function countFiles(items: FolderNode | null): number {
  if (!items) return 0;
  let count = 0;
  for (const item of items.children) {
    count += item.type === "folder" ? countFiles(item) : 1;
  }
  return count;
}
