import { atomConsts } from "@/models/hooks/atomConsts";
import { useAtomValue } from "jotai";
import { ResizableContainer } from "./ResizableContainer";

export function Frame({ src }: { src: string }) {
  const settings = useAtomValue(atomConsts.settingsJsonValue);
  if (!settings?.frame?.width || !settings.frame?.height) return null;

  return (
    <ResizableContainer
      initialWidth={settings.frame.width}
      initialHeight={settings.frame.height}
    >
      <iframe
        width="100%"
        height="100%"
        src={src}
        allow={settings.frame.allow}
        referrerPolicy={settings.frame.referrerPolicy}
        style={{ border: "none", borderRadius: 8 }}
        allowFullScreen
      />
    </ResizableContainer>
  );
}
