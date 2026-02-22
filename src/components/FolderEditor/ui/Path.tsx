import { OpenInNew } from "@mui/icons-material";
import { IconButton, Stack, TextField, Typography } from "@mui/material";

export function Path({
  folder,
  label,
  onChange,
}: {
  folder: FolderNode;
  label?: string;
  onChange: (folder: FolderNode) => void;
}) {
  return (
    <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
      <Typography variant="body1">{label ?? "Path"}</Typography>
      <TextField
        value={folder.path ?? ""}
        variant="standard"
        fullWidth
        onChange={(e) => onChange({ ...folder, path: e.currentTarget.value })}
      />
      <IconButton
        disabled={!folder.path}
        onClick={() => window.open(folder.path, "_blank")}
      >
        <OpenInNew />
      </IconButton>
    </Stack>
  );
}
