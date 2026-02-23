import { Box } from "@mui/material";
import { useSelectedItemNodeValue } from "../../jotai/useSelectedTreeNode";
import { useState } from "react";
import { fileSystem } from "../../utils/fileSystem";

export function Image() {
  const selectedItem: ItemNode | null = useSelectedItemNodeValue();
  const [nodeId, setNodeId] = useState<string>();
  const [svg, setSvg] = useState<string | null>(null);

  const handle = selectedItem?.parent?.handle ?? null;
  const fileName = selectedItem ? selectedItem.data.title + ".svg" : null;
  if (!selectedItem || !handle || !fileName) return null;

  if (nodeId !== selectedItem.nodeId) {
    setNodeId(selectedItem.nodeId);
    const load = async () => {
      try {
        await handle.getFileHandle(fileName); // 存在確認
      } catch {
        setSvg(null);
        return;
      }
      const svgText = await fileSystem.readTextAsync(handle, fileName);
      if (!svgText) {
        setSvg(null);
        return;
      }
      const bytes = new TextEncoder().encode(svgText);
      const bin = Array.from(bytes, (b) => String.fromCharCode(b)).join("");
      const base64 = btoa(bin);
      setSvg(base64);
    };
    load().catch(() => undefined);
  }

  if (!svg) return null;
  return (
    <Box>
      <img src={"data:image/svg+xml;base64," + svg} />
    </Box>
  );
}
