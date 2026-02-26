import { OpenInNew } from "@mui/icons-material";
import { IconButton, Stack, TextField, Typography } from "@mui/material";
import { filterString } from "@/utils/filterString";

export function Path({
  path,
  label,
  onChange,
}: {
  path?: string;
  label?: string;
  onChange: (path?: string) => void;
}) {
  return (
    <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
      <Typography variant="body1">{label ?? "Path"}</Typography>
      <TextField
        value={path ?? ""}
        variant="standard"
        autoComplete="off"
        spellCheck="false"
        fullWidth
        onChange={(e) => onChange(filterString(e.currentTarget.value))}
      />
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
