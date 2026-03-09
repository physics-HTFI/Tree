import { Typography } from "@mui/material";
import { atomTree } from "@/jotai/atomTree";
import { useAtomValue } from "jotai";

export function Counter() {
  const filteredTreeItems = useAtomValue(atomTree.filteredTreeValue);
  const count = countFiles(filteredTreeItems);

  return (
    <Typography color="primary" variant="h5" sx={{ mr: 3 }}>
      {count}
    </Typography>
  );
}

function countFiles(items?: FolderNode): number {
  if (!items) return 0;
  let count = 0;
  for (const item of items.children) {
    count += item.type === "folder" ? countFiles(item) : 1;
  }
  return count;
}
