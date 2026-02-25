import { useState } from "react";
import { Button, Grid, Stack, TextField, Typography } from "@mui/material";
import { useAppSettingsValue } from "../../../../jotai/useAppSettings";
import { filterString } from "../../../../utils/filterString";

const defaultForm = {};

export function AddFolder({
  onAdd,
}: {
  onAdd: (title: string, path?: string) => void;
}) {
  const settings = useAppSettingsValue();
  const [folder, setFolder] = useState<{ title?: string; path?: string }>(
    defaultForm,
  );

  const canAdd = Boolean(folder.title);

  const reset = () => setFolder(defaultForm);
  const update = (diff: { title?: string; path?: string }) => {
    const newFolder = { ...folder, ...diff };
    setFolder(newFolder);
  };
  const addFolder = async () => {
    if (!folder.title) return;
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
            fullWidth
            onChange={(e) =>
              update({ title: filterString(e.currentTarget.value) })
            }
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
            fullWidth
            onChange={(e) =>
              update({ path: filterString(e.currentTarget.value) })
            }
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
