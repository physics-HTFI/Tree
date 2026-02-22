import { getLinkUrl } from "./getLinkUrl";
import { useAppSettingsValue } from "../../jotai/useAppSettings";
import { useSelectedItemNodeValue } from "../../jotai/useSelectedTreeNode";
import { Button } from "@mui/material";

export function LinkButton() {
  const settings = useAppSettingsValue();
  const item = useSelectedItemNodeValue()?.data ?? null;

  const icon = settings.buttons?.link;
  const linkUrl = getLinkUrl(settings, item);
  if (!linkUrl || !icon) return null;
  return (
    <Button onClick={() => window.open(linkUrl, "_blank")} sx={{ minWidth: 0 }}>
      {icon}
    </Button>
  );
}
