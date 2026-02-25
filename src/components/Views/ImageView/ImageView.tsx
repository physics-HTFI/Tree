import { Chip, Stack } from "@mui/material";
import { useSelected } from "../../../jotai/useSelected";
import { useState } from "react";
import { useScroll } from "./hooks/useScroll";

export function ImageView() {
  const selectedItem: ItemNode | null = useSelected.useItemNodeValue();
  const [nodeId, setNodeId] = useState<string>();
  const svg = useSelected.useSvgValue();
  const { ref, scrolling, toggleScroll, timerStart } = useScroll(
    selectedItem?.entry?.speed ?? 0,
    !!svg,
  );

  if (nodeId !== selectedItem?.nodeId) {
    timerStart();
    setNodeId(selectedItem?.nodeId);
  }

  if (!svg) return null;
  return (
    <Stack direction="row" onClick={toggleScroll}>
      <img ref={ref} src={svg} />
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
