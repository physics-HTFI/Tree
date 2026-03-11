import { useState } from "react";
import { Button, Grid, Stack, Typography } from "@mui/material";
import { useAtomValue, useSetAtom } from "jotai";
import { atomsSelectedNode } from "@/models/hooks/atomSelectedNode";
import { validateFolderNode } from "@/models/validators/validateFolderNode";
import { TextField } from "@/components/share/TextField";
import { atomConsts } from "@/models/hooks/atomConsts";

const defaultValues: NewFolderNode = { title: "" };

export function AddFolder() {
  const settings = useAtomValue(atomConsts.settingsJsonValue);
  const [folder, setFolder] = useState<NewFolderNode>(defaultValues);
  const parent = useAtomValue(atomsSelectedNode.nodeValue).folderNode;
  const addFolderAsync = useSetAtom(atomsSelectedNode.addNewFolderNodeAsync);

  if (!settings?.labels || !parent) return null;

  const canAdd = validateFolderNode.canAddFolder(folder, parent);

  const update = (diff: Partial<NewFolderNode>) => {
    const newFolder = { ...folder, ...diff };
    validateFolderNode.modifyNewFolder(newFolder);
    setFolder(newFolder);
  };

  const reset = () => setFolder(defaultValues);

  const addFolder = async () => {
    await addFolderAsync(folder, parent);
    reset();
  };

  return (
    <Stack spacing={2}>
      <Grid
        container
        spacing={1}
        sx={{
          textAlign: "left",
          alignItems: "center",
        }}
      >
        {/* title */}
        <Grid size={3}>
          <Typography variant="body1">
            {settings.labels.title ?? "Title"}
          </Typography>
        </Grid>
        <Grid size={9}>
          <TextField
            value={folder.title}
            onChange={(value) => update({ title: value })}
          />
        </Grid>

        {/* path */}
        <Grid size={3}>
          <Typography variant="body1">
            {settings.labels.path ?? "Path"}
          </Typography>
        </Grid>
        <Grid size={9}>
          <TextField
            value={folder.path}
            onChange={(value) => update({ path: value })}
          />
        </Grid>
      </Grid>
      <Stack direction="row" spacing={1} justifyContent="flex-end">
        <Button variant="contained" onClick={addFolder} disabled={!canAdd}>
          追加
        </Button>
        <Button variant="outlined" onClick={reset}>
          リセット
        </Button>
      </Stack>
    </Stack>
  );
}
