import { useState } from "react";
import { IconButton, Popper } from "@mui/material";
import { MusicNote } from "@mui/icons-material";
import { TickPanel } from "./TickPanel";

export function TickDialogButton() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  return (
    <>
      <IconButton
        onClick={(e) => setAnchorEl(anchorEl ? null : e.currentTarget)}
        color="primary"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
      >
        <MusicNote />
      </IconButton>
      <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} placement="top-end">
        <TickPanel onClose={() => setAnchorEl(null)} />
      </Popper>
    </>
  );
}
