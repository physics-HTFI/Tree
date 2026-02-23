import { Box } from "@mui/material";
import { useSelectedItemNodeValue } from "../../jotai/useSelectedTreeNode";
import { useState } from "react";
import { getBase64 } from "./getBase64";

export function Image() {
  const selectedItem: ItemNode | null = useSelectedItemNodeValue();
  const [nodeId, setNodeId] = useState<string>();
  const [svg, setSvg] = useState<string | null>(null);

  const handle = selectedItem?.parent?.handle ?? null;
  const fileName = selectedItem ? selectedItem.data.title + ".svg" : null;
  if (!selectedItem || !handle || !fileName) return null;

  if (nodeId !== selectedItem.nodeId) {
    setNodeId(selectedItem.nodeId);
    getBase64(handle, fileName)
      .then(setSvg)
      .catch(() => undefined);
  }

  if (!svg) return null;
  return (
    <Box>
      <img src={"data:image/svg+xml;base64," + svg} />
    </Box>
  );
}
