import { useAtomValue } from "jotai";
import { ButtonBase } from "../ui/ButtonBase";
import { atomsSelectedNode } from "@/models/hooks/atomSelectedNode";
import { atomConsts } from "@/models/hooks/atomConsts";

export function GoToLinkButton() {
  const settings = useAtomValue(atomConsts.settingsJsonValue);
  const node = useAtomValue(atomsSelectedNode.nodeValue).itemNode;
  const item = node?.entry;

  if (!settings?.expressions?.link || node?.isReference || !item?.title)
    return null;
  const linkUrl = settings.expressions.link.replace("{{key}}", item.title);
  return (
    <ButtonBase type="link" onClick={() => window.open(linkUrl, "_blank")} />
  );
}
