import { atomConsts } from "@/models/hooks/atomConsts";
import { useAtomValue } from "jotai";
import { useState } from "react";

export function Window({ src }: { src: string }) {
  const settings = useAtomValue(atomConsts.settingsJsonValue);
  const [prevSrc, setPrevSrc] = useState<string>();
  if (!settings?.frame?.width || !settings.frame?.height) return null;

  if (src !== prevSrc) {
    setPrevSrc(src);
    const features = `width=${settings.frame.width},height=${settings.frame.height},top=0,left=${window.parent.screen.width - settings.frame.width}`;
    window.open(src, "_blank", features); // note: YouTube blocks programmatic closing (even when the window isn’t opened via _blank).
  }
  return <></>;
}
