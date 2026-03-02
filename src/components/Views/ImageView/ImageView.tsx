import { Chip, Stack } from "@mui/material";
import { useScroll } from "./hooks/useScroll";
import { atomsSelected } from "@/jotai/atomSelected";
import { useAtomValue } from "jotai";
import { useState } from "react";

export function ImageView() {
  const svg = useAtomValue(atomsSelected.svgBase64);
  const id = useAtomValue(atomsSelected.nodeId);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const itemNode = useAtomValue(atomsSelected.nodeValue).selectedItemNode;
  const { ref, scrolling, toggleScroll, timerStart, timerStop } = useScroll(
    itemNode?.entry?.speed ?? 0,
  );

  if (id !== currentId) {
    // 画像読み込み失敗時に「自動スクロール」ラベルが残らないようにする。
    // （onErrorだと遅延が発生して一瞬残るためここで行う。）
    timerStop();
    setCurrentId(id);
  }

  if (!svg || itemNode?.hasSvg !== true) {
    timerStop();
    return null;
  }
  return (
    <Stack direction="row" onClick={toggleScroll}>
      <img
        ref={ref}
        src={svg}
        onLoad={() => {
          timerStart();
          window.scrollTo(0, 0);
        }}
        style={{
          objectFit: "none",
          alignSelf: "flex-start",
          paddingTop: 8,
          paddingBottom: 8,
        }}
      />
      <Chip
        label="自動スクロール"
        variant="outlined"
        size="small"
        sx={{
          position: "fixed",
          top: 48,
          right: 152,
          visibility: scrolling ? undefined : "hidden",
          pointerEvents: "none",
        }}
      />
    </Stack>
  );
}
