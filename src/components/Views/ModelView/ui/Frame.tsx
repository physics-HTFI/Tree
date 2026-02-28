import { atomAppSettingsValue } from "@/jotai/atomAppSettings";
import { useAtomValue } from "jotai";

export function Frame({ src }: { src: string }) {
  const settings = useAtomValue(atomAppSettingsValue);
  if (!settings.frame?.width || !settings.frame?.height) return null;

  return (
    <iframe
      width={settings.frame.width}
      height={settings.frame.height}
      src={src}
      allow={settings.frame.allow}
      referrerPolicy={settings.frame.referrerPolicy}
      style={{ border: "none" }}
      allowFullScreen
    />
  );
}
