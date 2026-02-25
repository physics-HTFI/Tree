import { useAppSettingsValue } from "../../../jotai/useAppSettings";
import { useSelected } from "../../../jotai/useSelected";
import { ButtonBase } from "../ui/ButtonBase";

export function GoToLinkButton() {
  const settings = useAppSettingsValue();
  const item = useSelected.useItemNodeValue()?.entry ?? null;

  if (!settings.expressions?.link || !item?.title) return null;
  const linkUrl = settings.expressions.link.replace("{{key}}", item.title);
  return (
    <ButtonBase type="link" onClick={() => window.open(linkUrl, "_blank")} />
  );
}
