import { useSelectedItemNodeValue } from "../../jotai/useSelectedTreeNode";
import { useState } from "react";
import { useModelEnabledValue } from "../../jotai/useModelEnabled";
import { useAppSettingsValue } from "../../jotai/useAppSettings";

export function Model() {
  const settings = useAppSettingsValue();
  const item = useSelectedItemNodeValue();
  const modelEnabled = useModelEnabledValue();
  const [prevSrc, setPrevSrc] = useState<string>();

  if (
    !settings.expressions?.pop ||
    !settings.expressions?.frame ||
    !settings.expressions?.is_id
  )
    return null;
  if (!modelEnabled) return;

  const path = item?.data?.path;
  let src = path;
  let pop: boolean | null = null;
  if (path) {
    const isUrl = path.startsWith("https://");
    pop = isUrl || (item?.data?.pop ?? false);
    if (!isUrl) {
      const expression = pop
        ? settings.expressions.pop
        : settings.expressions.frame;
      src = expression
        .replace("{{ID}}", path)
        .replace("{{START}}", (item?.data.start ?? 0).toString());
    }
    const isId = new RegExp(settings.expressions.is_id).test(path);
    if (!isId && !isUrl) {
      pop = null;
      src = undefined;
    }
  }

  if (src !== prevSrc) {
    setPrevSrc(src);
    if (!pop || !path) return;
    const features = `width=500,height=400,top=0,left=${window.parent.screen.width - 500}`;
    window.open(src, "_blank", features); // note: YouTube blocks programmatic closing even when the window isn’t opened via _blank.
  }

  if (pop !== false) return null;
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
