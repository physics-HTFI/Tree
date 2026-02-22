import { IconButton } from "@mui/material";
import { getLinkUrl } from "./getLinkUrl";
import { Search } from "@mui/icons-material";
import { useAppSettingsValue } from "../../jotai/useAppSettings";
import { useSelectedItemNodeValue } from "../../jotai/useSelectedTreeNode";

export function LinkButton() {
  const settings = useAppSettingsValue();
  const item = useSelectedItemNodeValue()?.data ?? null;

  const linkUrl = getLinkUrl(settings, item);
  if (!linkUrl) return null;
  return (
    <IconButton color="primary" onClick={() => window.open(linkUrl, "_blank")}>
      <Search />
    </IconButton>
  );
}
