import { useSelectedItemNodeValue } from "../../jotai/useSelectedTreeNode";
import { useState } from "react";
import { useModelEnabledValue } from "../../jotai/useModelEnabled";
import { useAppSettingsValue } from "../../jotai/useAppSettings";

export function Model() {
  const settings = useAppSettingsValue();
  const item = useSelectedItemNodeValue();
  const modelEnabled = useModelEnabledValue();
  const [prevSrc, setPrevSrc] = useState<string | null>(null);

  if (
    !settings.expressions?.pop ||
    !settings.expressions?.frame ||
    !settings.expressions?.is_url ||
    !settings.expressions?.is_id
  )
    return null;

  const path = item?.data?.path;
  const isUrl = path
    ? new RegExp(settings.expressions.is_url).test(path)
    : null;
  const isId = path ? new RegExp(settings.expressions.is_id).test(path) : null;

  if (!modelEnabled || !path || (!isUrl && !isId)) {
    if (prevSrc) setPrevSrc(null);
    return null;
  }

  const isWindow = isUrl || (item?.data?.window ?? false);
  const expression = isWindow
    ? settings.expressions.pop
    : settings.expressions.frame;
  const src = isUrl
    ? path
    : expression
        .replace("{{ID}}", path)
        .replace("{{START}}", (item?.data.start ?? 0).toString());

  if (src !== prevSrc) {
    setPrevSrc(src);
    if (!isWindow) return;
    const features = `width=500,height=400,top=0,left=${window.parent.screen.width - 500}`;
    window.open(src, "_blank", features); // note: YouTube blocks programmatic closing even when the window isn’t opened via _blank.
  }

  if (isWindow) return null;
  return (
    <iframe
      width="500"
      height="400"
      src={src}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />
  );
}
