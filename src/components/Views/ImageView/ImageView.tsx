import { Chip, Stack } from "@mui/material";
import { useSelectedItemNodeValue } from "../../../jotai/useSelectedTreeNode";
import { useState } from "react";
import { getBase64 } from "./utils/getBase64";
import { useScroll } from "./hooks/useScroll";

export function ImageView() {
  const selectedItem: ItemNode | null = useSelectedItemNodeValue();
  const [nodeId, setNodeId] = useState<string>();
  const [svg, setSvg] = useState<string | null>(null);
  const { ref, scrolling, toggleScroll, timerStart } = useScroll(
    selectedItem?.entry?.speed ?? 0,
    !!svg,
  );

  const handle = selectedItem?.parent?.handle ?? null;
  const fileName = selectedItem ? selectedItem.entry.title + ".svg" : null;
  if (!selectedItem || !handle || !fileName) return null;

  if (nodeId !== selectedItem.nodeId) {
    timerStart();
    setNodeId(selectedItem.nodeId);
    getBase64(handle, fileName)
      .then(setSvg)
      .catch(() => undefined);
  }

  if (!svg) return null;
  return (
    <Stack direction="row" onClick={toggleScroll}>
      <img ref={ref} src={"data:image/svg+xml;base64," + svg} />
      <Chip
        label="自動スクロール"
        variant="outlined"
        size="small"
        sx={{
          position: "sticky",
          top: 8,
          ml: -7,
          visibility: scrolling ? undefined : "hidden",
          pointerEvents: "none",
        }}
      />
    </Stack>
  );
}
