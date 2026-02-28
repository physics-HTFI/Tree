import { useState } from "react";
import { useAtomValue } from "jotai";
import { atomAppSettingsValue } from "@/jotai/atomAppSettings";
import { atomModelViewEnabled } from "@/jotai/atomModelViewEnabled";
import { atomsSelected } from "@/jotai/atomSelected";
import { isUrl } from "@/generics/utils/isUrl";

export function ModelView() {
  const settings = useAtomValue(atomAppSettingsValue);
  const item = useAtomValue(atomsSelected.nodeValue).selectedItemNode;
  const modelEnabled = useAtomValue(atomModelViewEnabled);
  const [prevSrc, setPrevSrc] = useState<string | null>(null);

  if (
    !settings.expressions?.pop ||
    !settings.expressions?.frame ||
    !settings.expressions?.is_id ||
    !settings.frame?.width ||
    !settings.frame?.height
  )
    return null;

  const path = item?.entry?.path;
  const hasUrl = isUrl(path);
  const hasId = path ? new RegExp(settings.expressions.is_id).test(path) : null;

  if (!modelEnabled || !path || (!hasUrl && !hasId)) {
    if (prevSrc) setPrevSrc(null);
    return null;
  }

  const isWindow = hasUrl || (item?.entry?.window ?? false);
  const expression = isWindow
    ? settings.expressions.pop
    : settings.expressions.frame;
  const src = hasUrl
    ? path
    : expression
        .replace("{{ID}}", path)
        .replace("{{START}}", (item?.entry.start ?? 0).toString());

  if (src !== prevSrc) {
    setPrevSrc(src);
    if (!isWindow) return;
    const features = `width=${settings.frame.width},height=${settings.frame.height},top=0,left=${window.parent.screen.width - settings.frame.width}`;
    window.open(src, "_blank", features); // note: YouTube blocks programmatic closing (even when the window isn’t opened via _blank).
  }

  if (isWindow) return null;
  return (
    <iframe
      width={settings.frame.width}
      height={settings.frame.height}
      src={src}
      allow={settings.frame.allow}
      referrerPolicy={settings.frame.referrerPolicy}
      allowFullScreen
    />
  );
}
