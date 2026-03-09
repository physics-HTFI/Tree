import { atomConstants } from "@/jotai/atomConstants";
import { atomTree } from "@/jotai/atomTree";
import { itemBase64 } from "@/jotai/utils/itemBase64";
import { fileName } from "@/utils/fileName";
import { useAtomValue } from "jotai";
import { useEffect, useRef, useState } from "react";

export function Audio({ path }: { path: string }) {
  const settings = useAtomValue(atomConstants.settingsJsonValue);
  const referenceTree = useAtomValue(atomTree.referenceTreeValue);
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
    const { handle, name } = getHandle(path, referenceTree);
    if (!handle || !name) {
      setSrc(undefined);
      return null;
    }
    itemBase64
      .readMp3FromFileAsync(handle, name)
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

function getHandle(
  path: string,
  referenceTree?: FolderNode,
): { handle?: FileSystemDirectoryHandle; name?: string } {
  const split = path.split("/");
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
