import { Chip, Stack } from "@mui/material";
import { useScroll } from "./hooks/useScroll";
import { atomsSelected } from "../../../jotai/share/atomSelected";
import { useAtomValue } from "jotai";

export function ImageView() {
  const svg = useAtomValue(atomsSelected.svgBase64);
  const itemNode = useAtomValue(atomsSelected.itemNodeValue);
  const { ref, scrolling, toggleScroll, timerStart, timerStop } = useScroll(
    itemNode?.entry?.speed ?? 0,
  );

  if (!svg) {
    timerStop();
    return null;
  }
  return (
    <Stack direction="row" onClick={toggleScroll}>
      <img
        ref={ref}
        src={svg}
        onLoad={timerStart}
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
