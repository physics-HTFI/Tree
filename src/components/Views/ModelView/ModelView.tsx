import { useAtomValue } from "jotai";
import { atomsSelected } from "@/jotai/atomSelected";
import { isUrl } from "@/generics/utils/isUrl";
import { fileName } from "@/utils/fileName";
import { Audio } from "./ui/Audio";
import { Frame } from "./ui/Frame";
import { Window } from "./ui/Window";
import { atomConsts } from "@/jotai/atomConsts";
import { atomOptions } from "@/jotai/atomOptions";

export function ModelView() {
  const { pop, frame, is_id } =
    useAtomValue(atomConsts.settingsJsonValue)?.expressions ?? {};
  const node = useAtomValue(atomsSelected.nodeValue).selectedItemNode;
  const { path, window, start } = node?.entry ?? {};
  const modelEnabled = useAtomValue(atomOptions.modelViewEnabled);

  if (!pop || !frame || !is_id) return null;
  if (!node || !path) return null;
  if (!modelEnabled) return null;

  const type = isUrl(path)
    ? "url"
    : new RegExp(is_id).test(path)
      ? "id"
      : fileName.isMp3File(path)
        ? "mp3"
        : null;
  if (!type) return null;

  if (type === "mp3") {
    return <Audio path={path} />;
  }

  const isFrame = type === "id" && !window;
  const expression = isFrame ? frame : pop;
  const src =
    type === "url"
      ? path
      : expression
          .replace("{{ID}}", path)
          .replace("{{START}}", (start ?? 0).toString());

  return isFrame ? <Frame src={src} /> : <Window src={src} />;
}
