import { useDebounce } from "@/generics/hooks/useDebounce";
import { atomsSelected } from "@/models/hooks/atomSelected";
import { modifierFolderNode } from "@/models/modifiers/modifierFolderNode";
import {
  Delete,
  Folder,
  ImageOutlined,
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
import { useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";

export function SortItems() {
  const folder = useAtomValue(atomsSelected.nodeValue).selectedFolderNode;
  const updateAsync = useSetAtom(atomsSelected.setFolderNodeAsync);
  const { debounced: debouncedUpdate } = useDebounce(updateAsync);
  const [list, setList] = useState(folder?.children || []);
  const [id, setId] = useState<string>();

  if (!folder) return null;

  const move = (
    from: number,
    to: number | null, // nullの場合は削除
  ) => {
    if (to !== null && (to < 0 || to >= list.length)) return;
    const newList = [...list];
    const [moved] = newList.splice(from, 1);
    if (to !== null) newList.splice(to, 0, moved);
    setList(newList);

    const newFolder = { ...folder, children: newList };
    debouncedUpdate(newFolder, 1000);
  };

  return (
    <List dense={true}>
      {list.map((item, i) => (
        <ListItem
          key={item.nodeId}
          sx={{
            bgcolor: item.nodeId === id ? "grey.300" : undefined,
            height: 32,
            ":hover": { bgcolor: "grey.100", cursor: "pointer" },
          }}
          onClick={() => setId(item.nodeId)}
          tabIndex={i} // onKeyDownを有効にするために必要
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") move(i, i + 1);
            if (e.key === "ArrowUp") move(i, i - 1);
          }}
          secondaryAction={
            item.nodeId === id && (
              <Stack direction="row">
                <IconButton size="small" onClick={() => move(i, i + 1)}>
                  <KeyboardArrowDown fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => move(i, i - 1)}>
                  <KeyboardArrowUp fontSize="small" />
                </IconButton>
                <IconButton
                  disabled={
                    !modifierFolderNode.canRemoveChild(item.nodeId, list)
                  }
                  size="small"
                  color="error"
                  onClick={() => move(i, null)}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Stack>
            )
          }
        >
          <ListItemIcon>
            {item.type === "folder" ? (
              <Folder />
            ) : item.hasSvg ? (
              <ImageOutlined />
            ) : null}
          </ListItemIcon>
          <ListItemText
            primary={item.type === "folder" ? item.title : item.entry.title}
          />
        </ListItem>
      ))}
    </List>
  );
}
