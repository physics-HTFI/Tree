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
    highlighted: "highlighted",
    notes: "Notes",
    ...settings?.labels?.file,
  };
  const time = { min: 100, max: 300, ...settings?.time };
  const start = { min: 0, max: 100, ...settings?.start };
  const ticks = { min: 50, max: 200, ...settings?.ticks };

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
      {/* path */}
      <Grid size={3}>
        <Typography variant="body1">{labels.path}</Typography>
      </Grid>
      <Grid size={9}>
        <TextField value={node.path ?? ""} variant="standard" fullWidth />
      </Grid>

      {/* time */}
      <Grid size={3}>
        <Typography variant="body1">{labels.time}</Typography>
      </Grid>
      <Grid size={2}>
        <TextField
          value={node.time ? getTimeString(node.time) : ""}
          variant="standard"
          fullWidth
        />
      </Grid>
      <Grid size={7} sx={{ pl: 0.5 }}>
        <Slider
          value={node.time ?? time.min}
          min={time.min}
          max={time.max}
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
          value={node.start ?? ""}
          variant="standard"
          type="number"
          fullWidth
        />
      </Grid>
      <Grid size={7} sx={{ pl: 0.5 }}>
        <Slider
          value={node.start ?? start.min}
          min={start.min}
          max={start.max}
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
          value={node.ticks ?? ""}
          variant="standard"
          type="number"
          fullWidth
        />
      </Grid>
      <Grid size={7} sx={{ pl: 0.5 }}>
        <Slider
          value={node.ticks ?? ticks.min}
          min={ticks.min}
          max={ticks.max}
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
          {settings?.keys?.map((key, index) => (
            <MenuItem key={index} value={key.key}>
              {key.label ?? "---"}
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
          value={node.tier ?? 0}
          onChange={() => {}}
          variant="standard"
          fullWidth
          slotProps={{}}
        >
          {settings?.tiers
            ?.map((tier, i) => ({ tier, i }))
            ?.reverse()
            ?.map((v) => (
              <MenuItem key={v.tier.label} value={v.i}>
                <Typography
                  variant="body1"
                  sx={{
                    color: v.tier.color,
                    textDecoration: v.tier.underline ? "underline" : undefined,
                  }}
                >
                  {v.tier.label}
                </Typography>
              </MenuItem>
            ))}
        </Select>
      </Grid>

      {/* selected */}
      <Grid size={3}>
        <Typography variant="body1">{labels.highlighted}</Typography>
      </Grid>
      <Grid size={9}>
        <Checkbox
          checked={node.highlighted ?? false}
          size="small"
          sx={{ p: 0, display: "inline-block" }}
        />
      </Grid>

      {/* notes */}
      <Grid size={3}>
        <Typography variant="body1">{labels.notes}</Typography>
      </Grid>
      <Grid size={9}>
        <TextField
          value={node.notes ?? ""}
          variant="standard"
          multiline
          fullWidth
        />
      </Grid>
    </Grid>
  );
}
