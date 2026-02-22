import { Button } from "@mui/material";
import { useUnselect } from "../../jotai/useSelectedTreeNode";
import { useAppSettingsValue } from "../../jotai/useAppSettings";

export function CloseButton() {
  const { unselect } = useUnselect();

  const settings = useAppSettingsValue();
  const icon = settings.buttons?.close;
  if (!icon) return null;

  return (
    <Button onClick={unselect} sx={{ minWidth: 0 }}>
      {icon}
    </Button>
  );
}
