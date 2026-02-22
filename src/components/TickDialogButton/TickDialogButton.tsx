import { useState } from "react";
import { useSelectedItemNodeValue } from "../../jotai/useSelectedTreeNode";
import { IconButton } from "@mui/material";
import { MusicNote } from "@mui/icons-material";
import { TickDialog } from "./TickDialog";

export function TickDialogButton() {
  const [tickOpen, setTickOpen] = useState(false);
  const selectedItem = useSelectedItemNodeValue();

  return (
    <>
      <IconButton
        onClick={() => setTickOpen(true)}
        color="primary"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
      >
        <MusicNote />
      </IconButton>
      <TickDialog
        open={tickOpen}
        onClose={() => setTickOpen(false)}
        defaultBpm={selectedItem?.data?.ticks}
      />
    </>
  );
}
