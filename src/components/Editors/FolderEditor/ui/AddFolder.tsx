import { useState } from "react";
import { Button, Grid, Stack, Typography } from "@mui/material";
import { useAtomValue, useSetAtom } from "jotai";
import { atomsSelected } from "@/jotai/atomSelected";
import { modifierFolderNode } from "@/modifiers/modifierFolderNode";
import { TextField } from "@/components/share/TextField";
import { atomConsts } from "@/jotai/atomConsts";

const defaultValues: NewFolderNode = { title: "" };

export function AddFolder() {
  const settings = useAtomValue(atomConsts.settingsJsonValue);
  const [folder, setFolder] = useState<NewFolderNode>(defaultValues);
  const parent = useAtomValue(atomsSelected.nodeValue).selectedFolderNode;
  const addFolderAsync = useSetAtom(atomsSelected.addNewFolderNodeAsync);

  if (!settings?.labels) return null;

  const canAdd = modifierFolderNode.canAddFolder(folder, parent);

  const update = (diff: Partial<NewFolderNode>) => {
    const newFolder = { ...folder, ...diff };
    modifierFolderNode.modifyNewFolder(newFolder);
    setFolder(newFolder);
  };

  const reset = () => setFolder(defaultValues);

  const addFolder = async () => {
    await addFolderAsync(folder);
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
