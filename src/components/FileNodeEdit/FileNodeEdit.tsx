import {
  Checkbox,
  Grid,
  MenuItem,
  Select,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import { useSettingsValue } from "./_useSettingsValue";
import { getTimeString } from "./getTimeString";

export function FileNodeEdit() {
  const settings = useSettingsValue();

  const labels: Record<keyof FileNode, string> = {
    title: "Title",
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

  const node: FileNode = {
    title: "Example File",
    path: "example-file",
    time: 300,
    start: 0,
    ticks: 100,
    key: 0,
    tier: 0,
    selected: false,
    notes: "This is an example file node.",
  };

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
      {/* title */}
      <Grid size={3}>
        <Typography variant="body1">{labels.title}</Typography>
      </Grid>
      <Grid size={9}>
        <TextField value={node.title} variant="standard" fullWidth />
      </Grid>

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
          {settings?.keys?.map((key) => (
            <MenuItem key={key} value={key}>
              {key}
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
                  textDecoration: tier.underline ? "underline" : "none",
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
