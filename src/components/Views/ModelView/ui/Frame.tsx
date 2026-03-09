import { atomConstants } from "@/jotai/atomConstants";
import { useAtomValue } from "jotai";

export function Frame({ src }: { src: string }) {
  const settings = useAtomValue(atomConstants.settingsJsonValue);
  if (!settings?.frame?.width || !settings.frame?.height) return null;

  return (
    <iframe
      width={settings.frame.width}
      height={settings.frame.height}
      src={src}
      allow={settings.frame.allow}
      referrerPolicy={settings.frame.referrerPolicy}
      style={{ border: "none", borderRadius: 8 }}
      allowFullScreen
    />
  );
}
