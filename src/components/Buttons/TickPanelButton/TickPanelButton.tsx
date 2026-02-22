import { useState } from "react";
import { Popper } from "@mui/material";
import { TickPanel } from "./TickPanel";
import { useAppSettingsValue } from "../../../jotai/useAppSettings";
import { ButtonBase } from "../ui/ButtonBase";

export function TickPanelButton() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const settings = useAppSettingsValue();
  const icon = settings.buttons?.tick;
  if (!icon) return null;

  return (
    <>
      <ButtonBase
        type="tick"
        onClick={(e) => setAnchorEl(anchorEl ? null : e.currentTarget)}
      />
      <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} placement="top-end">
        <TickPanel onClose={() => setAnchorEl(null)} />
      </Popper>
    </>
  );
}
