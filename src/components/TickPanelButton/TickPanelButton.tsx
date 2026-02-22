import { useState } from "react";
import { Button, Popper } from "@mui/material";
import { TickPanel } from "./TickPanel";
import { useAppSettingsValue } from "../../jotai/useAppSettings";

export function TickPanelButton() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const settings = useAppSettingsValue();
  const icon = settings.buttons?.tick;
  if (!icon) return null;

  return (
    <>
      <Button
        onClick={(e) => setAnchorEl(anchorEl ? null : e.currentTarget)}
        sx={{ minWidth: 0 }}
      >
        {icon}
      </Button>
      <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} placement="top-end">
        <TickPanel onClose={() => setAnchorEl(null)} />
      </Popper>
    </>
  );
}
