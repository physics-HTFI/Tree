import { useAtomValue } from "jotai";
import { useSelected } from "../../../jotai/useSelected";
import { ButtonBase } from "../ui/ButtonBase";
import { atomAppSettingsValue } from "../../../jotai/share/atomAppSettings";

export function GoToLinkButton() {
  const settings = useAtomValue(atomAppSettingsValue);
  const item = useSelected.useItemNodeValue()?.entry ?? null;

  if (!settings.expressions?.link || !item?.title) return null;
  const linkUrl = settings.expressions.link.replace("{{key}}", item.title);
  return (
    <ButtonBase type="link" onClick={() => window.open(linkUrl, "_blank")} />
  );
}
