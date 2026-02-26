import { useState } from "react";
import { Button, Grid, Stack, TextField, Typography } from "@mui/material";
import { atomAppSettingsValue } from "@/jotai/atomAppSettings";
import { useAtomValue } from "jotai";
import { atomsSelected } from "@/jotai/atomSelected";
import { modifierFolderNode } from "@/modifiers/modifierFolderNode";

type Value = {
  title: string;
  path?: string;
};

const defaultValues: Value = { title: "" };

export function AddFolder({
  onAdd,
}: {
  onAdd: (title: string, path?: string) => void;
}) {
  const settings = useAtomValue(atomAppSettingsValue);
  const [folder, setFolder] = useState<Value>(defaultValues);
  const parent = useAtomValue(atomsSelected.nodeValue).selectedFolderNode;

  const canAdd = modifierFolderNode.canAdd(folder, parent);

  const reset = () => setFolder(defaultValues);

  const update = (diff: Partial<Value>) => {
    const newFolder = { ...folder, ...diff };
    modifierFolderNode.modify(newFolder);
    setFolder(newFolder);
  };

  const addFolder = async () => {
    if (!canAdd) return;
    onAdd(folder.title, folder.path);
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
