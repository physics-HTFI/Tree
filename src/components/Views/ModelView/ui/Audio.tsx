import { atomConsts } from "@/models/hooks/atomConsts";
import { atomsSelectedNode } from "@/models/hooks/atomSelectedNode";
import { fileName } from "@/models/utils/fileName";
import { useAtomValue } from "jotai";
import { useEffect, useRef, useState } from "react";

export function Audio({ path }: { path: string }) {
  const settings = useAtomValue(atomConsts.settingsJsonValue);
  const src = useAtomValue(atomsSelectedNode.audioBase64);
  const [curFileName, setCurFileName] = useState<string>();
  const ref = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.volume = 0.5;
    ref.current.focus();
  }, [curFileName]);

  if (!settings?.frame?.width) return null;
  if (!fileName.isMp3File(path)) return null;

  if (path !== curFileName) setCurFileName(path);

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
