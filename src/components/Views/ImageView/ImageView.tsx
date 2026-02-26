import { Chip, Stack } from "@mui/material";
import { useSelected } from "../../../jotai/useSelected";
import { useScroll } from "./hooks/useScroll";

export function ImageView() {
  const svg = useSelected.useSvgValue();
  const itemNode = useSelected.useItemNodeValue();
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
