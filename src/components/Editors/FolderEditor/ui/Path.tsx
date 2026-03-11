import { OpenInNew } from "@mui/icons-material";
import { IconButton, Stack, Typography } from "@mui/material";
import { useAtomValue, useSetAtom } from "jotai";
import { atomsSelectedNode } from "@/models/hooks/atomSelectedNode";
import { useState } from "react";
import { useDebounce } from "@/generics/hooks/useDebounce";
import { TextField } from "@/components/share/TextField";
import { atomConsts } from "@/models/hooks/atomConsts";

export function Path() {
  const settings = useAtomValue(atomConsts.settingsJsonValue);
  const folder = useAtomValue(atomsSelectedNode.nodeValue).folderNode;
  const [path, setPath] = useState<string>(folder?.path ?? "");
  const updateAsync = useSetAtom(atomsSelectedNode.updateFolderNodeAsync);
  const debouncedUpdate = useDebounce(updateAsync).debounced;

  if (!folder || !settings?.labels) return null;

  const updatePathAsync = async (path: string) => {
    setPath(path);
    debouncedUpdate(1000, { path }, folder);
  };

  return (
    <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
      <Typography variant="body1">{settings.labels.path ?? "Path"}</Typography>
      <TextField value={path} onChange={(value) => updatePathAsync(value)} />
      <IconButton
        disabled={!path}
        color="primary"
        onClick={() => path && window.open(path, "_blank")}
      >
        <OpenInNew />
      </IconButton>
    </Stack>
  );
}
