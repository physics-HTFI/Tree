import { getLinkUrl } from "./getLinkUrl";
import { useAppSettingsValue } from "../../../jotai/useAppSettings";
import { useSelectedItemNodeValue } from "../../../jotai/useSelectedTreeNode";
import { ButtonBase } from "../ui/ButtonBase";

export function LinkButton() {
  const settings = useAppSettingsValue();
  const item = useSelectedItemNodeValue()?.data ?? null;

  const linkUrl = getLinkUrl(settings, item);
  if (!linkUrl) return null;
  return (
    <ButtonBase type="link" onClick={() => window.open(linkUrl, "_blank")} />
  );
}
