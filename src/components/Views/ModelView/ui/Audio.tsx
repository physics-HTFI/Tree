import { atomAppSettingsValue } from "@/jotai/atomAppSettings";
import { itemBase64 } from "@/jotai/utils/itemBase64";
import { useAtomValue } from "jotai";
import { useState } from "react";

export function Audio({
  fileName,
  folder,
}: {
  fileName: string;
  folder?: FileSystemDirectoryHandle;
}) {
  const settings = useAtomValue(atomAppSettingsValue);
  const [curFolder, setCurFolder] = useState<FileSystemDirectoryHandle>();
  const [curFileName, setCurFileName] = useState<string>();
  const [src, setSrc] = useState<string | null>(null);
  if (!settings.frame?.width) return null;
  if (!folder) return null;

  if (folder !== curFolder || fileName !== curFileName) {
    setCurFolder(folder);
    setCurFileName(fileName);
    itemBase64
      .readMp3FromFileAsync(folder, fileName)
      .then(setSrc)
      .catch(() => setSrc(null));
  }

  return (
    <audio
      ref={(ref) => {
        if (!ref) return;
        ref.volume = 0.5;
        ref.focus();
      }}
      style={{ width: settings.frame.width, minHeight: 30, marginTop: 16 }}
      src={
        src ?? undefined /* 再生中に undefined を代入しても停止はしない模様 */
      }
      controls
      autoPlay
    />
  );
}
