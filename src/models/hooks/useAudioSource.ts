import { useAtomValue } from "jotai";
import { _atomTree } from "./backings/_atomTree";
import { mediaBase64 } from "./utils/mediaBase64";
import { useCallback } from "react";

export function useAudioSource() {
  const referenceTree = useAtomValue(_atomTree.referenceTreeValue);

  const readAudioSource = useCallback(
    async (path?: string) => {
      if (!path || !referenceTree) return undefined;

      const split = path.split("/");
      let current = referenceTree;
      for (let i = 0; i < split.length - 1; i++) {
        const name = split[i];
        const next = current?.children.find(
          (child) => child.type === "folder" && child.title === name,
        );
        if (!next || next.type !== "folder") return undefined;
        current = next;
      }

      const handle = current.handle;
      const name = split.at(-1);
      if (!handle || !name) return undefined;

      return await mediaBase64.readMp3FromFileAsync(handle, name);
    },
    [referenceTree],
  );

  return { readAudioSource };
}
