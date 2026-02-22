import { useState } from "react";
import { IconButton, Popper } from "@mui/material";
import { MusicNote } from "@mui/icons-material";
import { TickPanel } from "./TickPanel";

export function TickPanelButton() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  return (
    <>
      <IconButton
        onClick={(e) => setAnchorEl(anchorEl ? null : e.currentTarget)}
        color="primary"
      >
        <MusicNote />
      </IconButton>
      <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} placement="top-end">
        <TickPanel onClose={() => setAnchorEl(null)} />
      </Popper>
    </>
  );
}
