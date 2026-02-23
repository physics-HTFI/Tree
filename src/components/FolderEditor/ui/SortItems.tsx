import {
  Delete,
  Folder,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import {
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";
import { useState } from "react";

export function SortItems({
  defaultList,
  onChange,
}: {
  defaultList: TreeNode[];
  onChange: (list: TreeNode[]) => void;
}) {
  const [list, setList] = useState(defaultList);
  const [index, setIndex] = useState<number | null>(null);

  const disabledToMove = index === null;
  const disabledToRemove =
    disabledToMove || list[index].type === "folder" || list[index].hasSvg;

  const move = (
    from: number,
    to: number | null, // nullの場合は削除
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (to !== null && (to < 0 || to >= list.length)) return;
    const newList = [...list];
    const [moved] = newList.splice(from, 1);
    if (to !== null) newList.splice(to, 0, moved);
    setList(newList);
    setIndex(to);
    e.stopPropagation();
    onChange(newList);
  };

  return (
    <List dense={true}>
      {list.map((item, i) => (
        <ListItem
          key={i}
          sx={{
            bgcolor: i === index ? "grey.300" : undefined,
            ":hover": { bgcolor: "grey.100", cursor: "pointer" },
          }}
          onClick={() => setIndex(i)}
          secondaryAction={
            i === index && (
              <Stack direction="row" spacing={1}>
                <IconButton size="small" onClick={(e) => move(i, i + 1, e)}>
                  <KeyboardArrowDown />
                </IconButton>
                <IconButton size="small" onClick={(e) => move(i, i - 1, e)}>
                  <KeyboardArrowUp />
                </IconButton>
                <IconButton
                  disabled={disabledToRemove}
                  size="small"
                  color="error"
                  onClick={(e) => move(i, null, e)}
                >
                  <Delete />
                </IconButton>
              </Stack>
            )
          }
        >
          <ListItemIcon>{item.type === "folder" && <Folder />}</ListItemIcon>
          <ListItemText
            primary={item.type === "folder" ? item.title : item.data.title}
          />
        </ListItem>
      ))}
    </List>
  );
}
