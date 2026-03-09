import { useAtomValue } from "jotai";
import { ButtonBase } from "../ui/ButtonBase";
import { atomsSelected } from "@/jotai/atomSelected";
import { atomConsts } from "@/jotai/atomConsts";

export function GoToLinkButton() {
  const settings = useAtomValue(atomConsts.settingsJsonValue);
  const node = useAtomValue(atomsSelected.nodeValue).selectedItemNode;
  const item = node?.entry;

  if (!settings?.expressions?.link || node?.isReference || !item?.title)
    return null;
  const linkUrl = settings.expressions.link.replace("{{key}}", item.title);
  return (
    <ButtonBase type="link" onClick={() => window.open(linkUrl, "_blank")} />
  );
}
