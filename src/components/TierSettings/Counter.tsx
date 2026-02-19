import { Typography } from "@mui/material";
import { useFilteredTreeItemsValue } from "./_useFilteredTreeItemsValue";

export function Counter() {
  const filteredTreeItems = useFilteredTreeItemsValue();
  const count = countFiles(filteredTreeItems);

  return (
    <Typography
      variant="body1"
      sx={{ borderBottom: "1px solid black", mb: 1, textAlign: "center" }}
    >
      {count}
    </Typography>
  );
}

function countFiles(items: TreeNode[]): number {
  let count = 0;
  for (const item of items) {
    if (item.type === "file") {
      count++;
    } else if (item.type === "folder" && item.children) {
      count += countFiles(item.children);
    }
  }
  return count;
}
