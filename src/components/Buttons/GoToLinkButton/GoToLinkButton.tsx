import { useAtomValue } from "jotai";
import { ButtonBase } from "../ui/ButtonBase";
import { atomAppSettingsValue } from "@/jotai/atomAppSettings";
import { atomsSelected } from "@/jotai/atomSelected";

export function GoToLinkButton() {
  const settings = useAtomValue(atomAppSettingsValue);
  const node = useAtomValue(atomsSelected.nodeValue).selectedItemNode;
  const item = node?.entry;

  if (!settings.expressions?.link || node?.isReference || !item?.title)
    return null;
  const linkUrl = settings.expressions.link.replace("{{key}}", item.title);
  return (
    <ButtonBase type="link" onClick={() => window.open(linkUrl, "_blank")} />
  );
}
