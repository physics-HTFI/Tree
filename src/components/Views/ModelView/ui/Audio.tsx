import { atomConsts } from "@/jotai/atomConsts";
import { useAudioSource } from "@/jotai/useAudioSource";
import { fileName } from "@/utils/fileName";
import { useAtomValue } from "jotai";
import { useEffect, useRef, useState } from "react";

export function Audio({ path }: { path: string }) {
  const settings = useAtomValue(atomConsts.settingsJsonValue);
  const { readAudioSource } = useAudioSource();
  const [curFileName, setCurFileName] = useState<string>();
  const [src, setSrc] = useState<string>();
  const ref = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.volume = 0.5;
    ref.current.focus();
    return;
  }, [curFileName]);

  if (!settings?.frame?.width) return null;
  if (!fileName.isMp3File(path)) return null;

  if (path !== curFileName) {
    setCurFileName(path);
    readAudioSource(path)
      .then(setSrc)
      .catch(() => setSrc(undefined));
  }

  return (
    <audio
      ref={ref}
      style={{ width: settings.frame.width, minHeight: 30, marginTop: 16 }}
      src={
        src ?? undefined /* 再生中に undefined を代入しても停止はしない模様 */
      }
      controls
      autoPlay
    />
  );
}
