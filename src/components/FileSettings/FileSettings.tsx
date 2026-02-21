import {
  Checkbox,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import { useAppSettingsValue } from "./_useAppSettingsValue";
import { getTimeString } from "./getTimeString";
import { useSelectedItemDataValue } from "../../jotai/useSelectedTreeNode";
import { Brush, Search } from "@mui/icons-material";

export function FileSettings() {
  // フック
  const settings = useAppSettingsValue();

  type FileLabel = keyof NonNullable<Required<AppSettings>["labels"]["file"]>;
  const labels: Record<FileLabel, string> = {
    title: "Title",
    path: "Path",
    time: "Time",
    start: "Start",
    ticks: "Ticks",
    key: "Key",
    tier: "Tier",
    highlighted: "Highlighted",
    notes: "Notes",
    ...settings?.labels?.file,
  };
  const time = { min: 0, max: 300, ...settings?.time };
  const start = { min: 0, max: 300, ...settings?.start };
  const ticks = { min: 0, max: 300, ...settings?.ticks };

  const item = useSelectedItemDataValue();
  if (!item) return null;
  const searchUrl =
    settings?.searchExpression && item.title
      ? settings.searchExpression.replace(
          "{{key}}",
          item.title.replace(".svg", ""),
        )
      : null;

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
      <Grid size={12} sx={{ textAlign: "right" }}>
        {searchUrl && (
          <IconButton
            color="primary"
            onClick={() => window.open(searchUrl, "_blank")}
          >
            <Search />
          </IconButton>
        )}
        <IconButton color="primary">
          <Brush />
        </IconButton>
      </Grid>

      {/* path */}
      <Grid size={3}>
        <Typography variant="body1">{labels.path}</Typography>
      </Grid>
      <Grid size={9}>
        <TextField value={item.path ?? ""} variant="standard" fullWidth />
      </Grid>

      {/* time */}
      <Grid size={3}>
        <Typography variant="body1">{labels.time}</Typography>
      </Grid>
      <Grid size={2}>
        <TextField
          value={item.time ? getTimeString(item.time) : ""}
          variant="standard"
          fullWidth
        />
      </Grid>
      <Grid size={7} sx={{ pl: 0.5 }}>
        <Slider
          value={item.time ?? time.min}
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
          value={item.start ?? ""}
          variant="standard"
          type="number"
          fullWidth
        />
      </Grid>
      <Grid size={7} sx={{ pl: 0.5 }}>
        <Slider
          value={item.start ?? start.min}
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
          value={item.ticks ?? ""}
          variant="standard"
          type="number"
          fullWidth
        />
      </Grid>
      <Grid size={7} sx={{ pl: 0.5 }}>
        <Slider
          value={item.ticks ?? ticks.min}
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
          value={item.key ?? ""}
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
          value={item.tier ?? 0}
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
          checked={item.highlighted ?? false}
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
          value={item.notes ?? ""}
          variant="standard"
          multiline
          fullWidth
        />
      </Grid>
    </Grid>
  );
}
