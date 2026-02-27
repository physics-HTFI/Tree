import { useState } from "react";
import { Button, Grid, Stack, TextField, Typography } from "@mui/material";
import { atomAppSettingsValue } from "@/jotai/atomAppSettings";
import { useAtomValue, useSetAtom } from "jotai";
import { atomsSelected } from "@/jotai/atomSelected";
import { modifierFolderNode } from "@/modifiers/modifierFolderNode";

const defaultValues: NewFolderNode = { title: "" };

export function AddFolder() {
  const settings = useAtomValue(atomAppSettingsValue);
  const [folder, setFolder] = useState<NewFolderNode>(defaultValues);
  const parent = useAtomValue(atomsSelected.nodeValue).selectedFolderNode;
  const addFolderAsync = useSetAtom(atomsSelected.addNewFolderNodeAsync);

  const canAdd = modifierFolderNode.canAdd(folder, parent);

  const update = (diff: Partial<NewFolderNode>) => {
    const newFolder = { ...folder, ...diff };
    modifierFolderNode.modify(newFolder);
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
            {settings.labels?.title ?? "Title"}
          </Typography>
        </Grid>
        <Grid size={9}>
          <TextField
            value={folder.title ?? ""}
            variant="standard"
            autoComplete="off"
            spellCheck="false"
            fullWidth
            onChange={(e) => update({ title: e.currentTarget.value })}
          />
        </Grid>

        {/* path */}
        <Grid size={3}>
          <Typography variant="body1">
            {settings.labels?.path ?? "Path"}
          </Typography>
        </Grid>
        <Grid size={9}>
          <TextField
            value={folder.path ?? ""}
            variant="standard"
            autoComplete="off"
            spellCheck="false"
            fullWidth
            onChange={(e) => update({ path: e.currentTarget.value })}
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
