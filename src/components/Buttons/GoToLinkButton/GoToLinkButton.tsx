import { useAppSettingsValue } from "../../../jotai/useAppSettings";
import { useSelectedItemNodeValue } from "../../../jotai/useSelectedTreeNode";
import { ButtonBase } from "../ui/ButtonBase";

export function GoToLinkButton() {
  const settings = useAppSettingsValue();
  const item = useSelectedItemNodeValue()?.data ?? null;

  if (!settings.expressions?.link || !item?.title) return null;
  const linkUrl = settings.expressions.link.replace("{{key}}", item.title);
  return (
    <ButtonBase type="link" onClick={() => window.open(linkUrl, "_blank")} />
  );
}
