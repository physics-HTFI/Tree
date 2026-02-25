import { useSelectedItemNodeValue } from "../../../jotai/useSelectedTreeNode";
import { useState } from "react";
import { useModelEnabledValue } from "../../../jotai/useModelEnabled";
import { useAppSettingsValue } from "../../../jotai/useAppSettings";

export function ModelView() {
  const settings = useAppSettingsValue();
  const item = useSelectedItemNodeValue();
  const modelEnabled = useModelEnabledValue();
  const [prevSrc, setPrevSrc] = useState<string | null>(null);

  if (
    !settings.expressions?.pop ||
    !settings.expressions?.frame ||
    !settings.expressions?.is_url ||
    !settings.expressions?.is_id ||
    !settings.frame?.width ||
    !settings.frame?.height
  )
    return null;

  const path = item?.entry?.path;
  const isUrl = path
    ? new RegExp(settings.expressions.is_url).test(path)
    : null;
  const isId = path ? new RegExp(settings.expressions.is_id).test(path) : null;

  if (!modelEnabled || !path || (!isUrl && !isId)) {
    if (prevSrc) setPrevSrc(null);
    return null;
  }

  const isWindow = isUrl || (item?.entry?.window ?? false);
  const expression = isWindow
    ? settings.expressions.pop
    : settings.expressions.frame;
  const src = isUrl
    ? path
    : expression
        .replace("{{ID}}", path)
        .replace("{{START}}", (item?.entry.start ?? 0).toString());

  if (src !== prevSrc) {
    setPrevSrc(src);
    if (!isWindow) return;
    const features = `width=${settings.frame.width},height=${settings.frame.height},top=0,left=${window.parent.screen.width - settings.frame.width}`;
    window.open(src, "_blank", features); // note: YouTube blocks programmatic closing even when the window isn’t opened via _blank.
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
