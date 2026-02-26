import { useState } from "react";
import { Popper } from "@mui/material";
import { TickPanel } from "./Tick";
import { ButtonBase } from "../ui/ButtonBase";
import { useAtomValue } from "jotai";
import { atomAppSettingsValue } from "@/jotai/atomAppSettings";

export function ShowTickButton() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const settings = useAtomValue(atomAppSettingsValue);
  const icon = settings.buttons?.tick;
  if (!icon) return null;

  return (
    <>
      <ButtonBase
        type="tick"
        onClick={(e) => setAnchorEl(anchorEl ? null : e.currentTarget)}
      />
      <Popper
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        placement="bottom-end"
      >
        <TickPanel onClose={() => setAnchorEl(null)} />
      </Popper>
    </>
  );
}
