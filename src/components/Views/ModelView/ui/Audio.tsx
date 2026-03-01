import { atomAppSettingsValue } from "@/jotai/atomAppSettings";
import { atomTree } from "@/jotai/atomTree";
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
  const referenceTree = useAtomValue(atomTree.referenceTreeValue);
  const [curFolder, setCurFolder] = useState<FileSystemDirectoryHandle>();
  const [curFileName, setCurFileName] = useState<string>();
  const [src, setSrc] = useState<string | null>(null);
  if (!settings.frame?.width) return null;
  if (!folder) return null;

  if (folder !== curFolder || fileName !== curFileName) {
    setCurFolder(folder);
    setCurFileName(fileName);
    const { handle, name } = getHandle(fileName, folder, referenceTree);
    if (!handle || !name) {
      setSrc(null);
      return null;
    }
    itemBase64
      .readMp3FromFileAsync(handle, name)
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

function getHandle(
  path: string,
  folder: FileSystemDirectoryHandle,
  referenceTree: FolderNode | null,
): { handle?: FileSystemDirectoryHandle; name?: string } {
  const split = path.split("/");
  if (split.length === 1) return { handle: folder, name: path };

  let current = referenceTree;
  for (let i = 0; i < split.length - 1; i++) {
    const name = split[i];
    const next = current?.children.find(
      (child) => child.type === "folder" && child.title === name,
    );
    if (!next || next.type !== "folder") return {};
    current = next;
  }
  return { handle: current?.handle, name: split.at(-1) };
}
