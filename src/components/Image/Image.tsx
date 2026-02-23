import { Chip, Stack } from "@mui/material";
import { useSelectedItemNodeValue } from "../../jotai/useSelectedTreeNode";
import { useEffect, useRef, useState } from "react";
import { getBase64 } from "./getBase64";

export function Image() {
  const selectedItem: ItemNode | null = useSelectedItemNodeValue();
  const [nodeId, setNodeId] = useState<string>();
  const [svg, setSvg] = useState<string | null>(null);
  const ref = useRef<HTMLImageElement | null>(null);
  const [time, setTime] = useState<number>(0);
  const [scrolling, setScrolling] = useState<boolean>(true);
  const scrollTime = 240 * 1000;

  useEffect(() => {
    if (!svg || !ref.current || !scrolling) return;
    const scrollSpeed = ref.current.clientHeight / scrollTime; // スクロール量（px/ms）
    const interval = 1 / scrollSpeed; // 1pxスクロールする時間（ms）
    const delay =
      (0.5 * scrollTime * window.innerHeight) / ref.current.clientHeight;
    const id = setInterval(() => {
      setTime((t) => t + interval);
      if (delay < time) {
        window.scrollBy(0, scrollSpeed * interval);
      }
    }, interval);
    return () => clearInterval(id);
  }, [svg, time, scrolling, scrollTime]);

  const handle = selectedItem?.parent?.handle ?? null;
  const fileName = selectedItem ? selectedItem.data.title + ".svg" : null;
  if (!selectedItem || !handle || !fileName) return null;

  if (nodeId !== selectedItem.nodeId) {
    setTime(0);
    setScrolling(true);
    setNodeId(selectedItem.nodeId);
    getBase64(handle, fileName)
      .then(setSvg)
      .catch(() => undefined);
  }

  if (!svg) return null;
  return (
    <Stack
      direction="row"
      onClick={() => {
        setScrolling((s) => !s);
        setTime(scrollTime);
      }}
    >
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
