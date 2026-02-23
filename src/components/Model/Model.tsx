import { Box } from "@mui/material";
import { useSelectedItemNodeValue } from "../../jotai/useSelectedTreeNode";
import { useState } from "react";
import { useModelEnabledValue } from "../../jotai/useModelEnabled";

export function Model() {
  const currentItem = useSelectedItemNodeValue();
  const modelEnabled = useModelEnabledValue();
  const [item, setItem] = useState<ItemNode | null>(null);
  const [popup, setPopup] = useState<Window | null>(null);

  if (currentItem !== item) {
    setItem(currentItem);
    if (popup && !popup.closed) popup.close(); // （ページによって閉じないことがある）
    if (!modelEnabled) return;
    const path = currentItem?.data.path;
    if (path) {
      const features = `width=500,height=400,top=0,left=${window.parent.screen.width - 500}`;
      setPopup(window.open(path, "popup_window", features));
    }
  }

  return <Box sx={{ height: "90vh", bgcolor: "red" }}>Model</Box>;
}
