import { useDebounce } from "@/generics/hooks/useDebounce";
import { atomsSelectedNode } from "@/models/hooks/atomSelectedNode";
import { validateItemNode } from "@/models/validators/validateItemNode";
import {
  Delete,
  Folder,
  ImageOutlined,
  KeyboardArrowDown,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardArrowUp,
} from "@mui/icons-material";
import {
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
} from "@mui/material";
import { useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";

export function SortItems() {
  const folder = useAtomValue(atomsSelectedNode.nodeValue).folderNode;
  const updateAsync = useSetAtom(atomsSelectedNode.setFolderNodeAsync);
  const { debounced: debouncedUpdate } = useDebounce(updateAsync);
  const [list, setList] = useState(folder?.children || []);
  const [id, setId] = useState<string>();

  if (!folder) return null;

  const canMove = validateItemNode.canMoveItem(id, list);

  const move = (
    from: number,
    action: "up" | "down" | "left" | "right" | "delete",
  ) => {
    if (!canMove?.[action]) return;
    let to: number | null = null;
    switch (action) {
      case "up":
        to = from - 1;
        break;
      case "down":
        to = from + 1;
        break;
      case "left":
      case "right":
        return;
      case "delete":
        to = null;
        break;
    }
    const newList = [...list];
    const [moved] = newList.splice(from, 1);
    if (to !== null) newList.splice(to, 0, moved);
    setList(newList);
    const delayed = ["up", "down"].includes(action);
    debouncedUpdate({ children: newList }, delayed ? 1000 : 0);
  };

  return (
    <List dense={true}>
      {list.map((item, i) => (
        <ListItem
          key={item.nodeId}
          sx={{
            bgcolor: item.nodeId === id ? "grey.300" : undefined,
            height: 30,
            ":hover": { bgcolor: "grey.100", cursor: "pointer" },
          }}
          onClick={() => setId(item.nodeId)}
          tabIndex={i} // onKeyDownを有効にするために必要
          onKeyDown={(e) => {
            if (e.key === "ArrowDown" && canMove?.down) move(i, "down");
            if (e.key === "ArrowUp" && canMove?.up) move(i, "up");
            e.preventDefault(); // 矢印キーのデフォルトのスクロール動作を防止
          }}
          secondaryAction={
            item.nodeId === id && (
              <Stack direction="row">
                {/* ← */}
                <Tooltip title="上の階層に移動">
                  <IconButton
                    disabled={!canMove?.left}
                    size="small"
                    onClick={() => move(i, "left")}
                  >
                    <KeyboardArrowLeft fontSize="small" />
                  </IconButton>
                </Tooltip>

                {/* → */}
                <Tooltip title="下の階層に移動">
                  <IconButton
                    disabled={!canMove?.right}
                    size="small"
                    onClick={() => move(i, "right")}
                  >
                    <KeyboardArrowRight fontSize="small" />
                  </IconButton>
                </Tooltip>

                {/* Delete */}
                <IconButton
                  disabled={!canMove?.delete}
                  size="small"
                  color="error"
                  onClick={() => move(i, "delete")}
                >
                  <Delete fontSize="small" />
                </IconButton>

                {/* ↓ */}
                <Tooltip title="下に移動 (↓)">
                  <IconButton
                    disabled={!canMove?.down}
                    size="small"
                    onClick={() => move(i, "down")}
                  >
                    <KeyboardArrowDown fontSize="small" />
                  </IconButton>
                </Tooltip>

                {/* ↑ */}
                <Tooltip title="上に移動 (↑)">
                  <IconButton
                    disabled={!canMove?.up}
                    size="small"
                    onClick={() => move(i, "up")}
                  >
                    <KeyboardArrowUp fontSize="small" />
                  </IconButton>
                </Tooltip>
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
