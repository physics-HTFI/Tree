import {
  Checkbox,
  Grid,
  MenuItem,
  Select,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import { useAppSettingsValue } from "./_useAppSettingsValue";
import { getTimeString } from "./getTimeString";
import { useSelectedFileSettingsValue } from "../../jotai/useSelectedItem";

export function FileSettings() {
  // フック
  const settings = useAppSettingsValue();

  type FileLabel = keyof NonNullable<Required<AppSettings>["labels"]["file"]>;
  const labels: Record<FileLabel, string> = {
    path: "Path",
    time: "Time",
    start: "Start",
    ticks: "Ticks",
    key: "Key",
    tier: "Tier",
    selected: "Selected",
    notes: "Notes",
    ...settings?.labels?.file,
  };

  const node = useSelectedFileSettingsValue();
  if (!node) return null;
  return (
    <Grid
      container
      spacing={1}
      sx={{
        position: "fixed",
        bottom: 8,
        right: 8,
        textAlign: "left",
        maxWidth: 300,
        alignItems: "center",
      }}
    >
      {/* id */}
      <Grid size={3}>
        <Typography variant="body1">{labels.path}</Typography>
      </Grid>
      <Grid size={9}>
        <TextField value={node.path} variant="standard" fullWidth />
      </Grid>

      {/* time */}
      <Grid size={3}>
        <Typography variant="body1">{labels.time}</Typography>
      </Grid>
      <Grid size={2}>
        <TextField
          value={node.time ? getTimeString(node.time) : null}
          variant="standard"
          fullWidth
        />
      </Grid>
      <Grid size={7} sx={{ pl: 0.5 }}>
        <Slider
          value={node.time}
          min={settings?.time?.min}
          max={settings?.time?.max}
          step={10}
          valueLabelDisplay="auto"
          size="small"
        />
      </Grid>

      {/* start */}
      <Grid size={3}>
        <Typography variant="body1">{labels.start}</Typography>
      </Grid>
      <Grid size={2}>
        <TextField
          value={node.start}
          variant="standard"
          type="number"
          fullWidth
        />
      </Grid>
      <Grid size={7} sx={{ pl: 0.5 }}>
        <Slider
          value={node.start}
          min={settings?.start?.min}
          max={settings?.start?.max}
          valueLabelDisplay="auto"
          size="small"
        />
      </Grid>

      {/* ticks */}
      <Grid size={3}>
        <Typography variant="body1">{labels.ticks}</Typography>
      </Grid>
      <Grid size={2}>
        <TextField
          value={node.ticks}
          variant="standard"
          type="number"
          fullWidth
        />
      </Grid>
      <Grid size={7} sx={{ pl: 0.5 }}>
        <Slider
          value={node.ticks}
          min={settings?.ticks?.min}
          max={settings?.ticks?.max}
          valueLabelDisplay="auto"
          size="small"
        />
      </Grid>

      {/* key */}
      <Grid size={3}>
        <Typography variant="body1">{labels.key}</Typography>
      </Grid>
      <Grid size={9}>
        <Select
          value={node.key ?? ""}
          onChange={() => {}}
          variant="standard"
          fullWidth
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {Object.keys(settings?.keys ?? {}).map((key) => (
            <MenuItem key={key} value={key}>
              {settings?.keys?.[parseInt(key)] ?? "---"}
            </MenuItem>
          ))}
        </Select>
      </Grid>

      {/* tier */}
      <Grid size={3}>
        <Typography variant="body1">{labels.tier}</Typography>
      </Grid>
      <Grid size={9}>
        <Select
          value={node.tier}
          onChange={() => {}}
          variant="standard"
          fullWidth
        >
          {settings?.tiers?.map((tier, i) => (
            <MenuItem key={tier.label} value={i}>
              <Typography
                variant="body1"
                sx={{
                  color: tier.color,
                  textDecoration: tier.underline ? "underline" : undefined,
                }}
              >
                {tier.label}
              </Typography>{" "}
            </MenuItem>
          ))}
        </Select>
      </Grid>

      {/* selected */}
      <Grid size={3}>
        <Typography variant="body1">{labels.selected}</Typography>
      </Grid>
      <Grid size={9}>
        <Checkbox
          checked={node.selected}
          size="small"
          sx={{ p: 0, display: "inline-block" }}
        />
      </Grid>

      {/* notes */}
      <Grid size={3}>
        <Typography variant="body1">{labels.notes}</Typography>
      </Grid>
      <Grid size={9}>
        <TextField value={node.notes} variant="standard" multiline fullWidth />
      </Grid>
    </Grid>
  );
}
