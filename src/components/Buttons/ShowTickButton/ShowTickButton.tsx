import { useState } from "react";
import { Popper } from "@mui/material";
import { TickPanel } from "./Tick";
import { ButtonBase } from "../ui/ButtonBase";
import { useAtomValue } from "jotai";
import { atomConsts } from "@/models/hooks/atomConsts";

export function ShowTickButton() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>(undefined);

  const settings = useAtomValue(atomConsts.settingsJsonValue);
  const icon = settings?.buttons?.tick;
  if (!icon) return null;

  return (
    <>
      <ButtonBase
        type="tick"
        onClick={(e) => setAnchorEl(anchorEl ? undefined : e.currentTarget)}
      />
      <Popper
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        placement="bottom-end"
      >
        <TickPanel onClose={() => setAnchorEl(undefined)} />
      </Popper>
    </>
  );
}
