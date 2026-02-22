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
import { Brush, Search } from "@mui/icons-material";
import { useAppSettingsValue } from "../../jotai/useAppSettings";
import { useSelectedItemNodeValue } from "../../jotai/useSelectedTreeNode";
import { useUpdateFolderNode } from "../../jotai/useTreeItems";
import { toTimeString } from "./toTimeString";
import { getSearchUrl } from "./getSearchUrl";
import { useState } from "react";
import { fromTimeString } from "./fromTimeString";
import { useDebounce } from "./useDebounce";

export function ItemEditor() {
  // フック
  const settings = useAppSettingsValue();
  const selectedNode = useSelectedItemNodeValue();
  const { updateFolderNodeAsync } = useUpdateFolderNode(selectedNode?.nodeId);
  const [nodeId, setNodeId] = useState<string>();
  const [item, setItem] = useState<ItemData>();
  const { debounced: debouncedUpdate } = useDebounce(
    updateFolderNodeAsync,
    1000,
  );

  if (selectedNode?.nodeId !== nodeId) {
    setNodeId(selectedNode?.nodeId);
    setItem(selectedNode?.data);
  }
  if (!item) return null;

  const labels = settings.labels?.file;
  const searchUrl = getSearchUrl(settings, item);

  const update = (diff: ItemData) => {
    const newItem = { ...item, ...diff };
    setItem(newItem);
    debouncedUpdate(newItem);
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

      {/* title */}
      <Grid size={3}>
        <Typography variant="body1">{labels?.title ?? "Title"}</Typography>
      </Grid>
      <Grid size={9}>
        <TextField
          value={item.title ?? ""}
          variant="standard"
          fullWidth
          onChange={(e) => {
            if (e.currentTarget.value === "") return;
            update({ title: filterString(e.currentTarget.value) });
          }}
        />
      </Grid>

      {/* path */}
      <Grid size={3}>
        <Typography variant="body1">{labels?.path ?? "Path"}</Typography>
      </Grid>
      <Grid size={9}>
        <TextField
          value={item.path ?? ""}
          variant="standard"
          fullWidth
          onChange={(e) => {
            update({ path: filterString(e.currentTarget.value) });
          }}
        />
      </Grid>

      {/* time */}
      <Grid size={3}>
        <Typography variant="body1">{labels?.time ?? "Time"}</Typography>
      </Grid>
      <Grid size={2.5}>
        <TextField
          value={item.time ? toTimeString(item.time) : ""}
          variant="standard"
          fullWidth
          onChange={(e) => {
            const time = fromTimeString(e.currentTarget.value);
            update({ time });
          }}
        />
      </Grid>
      <Grid size={6.5} sx={{ pl: 0.5 }}>
        <Slider
          value={item.time}
          min={settings?.time?.min}
          max={settings?.time?.max}
          step={10}
          size="small"
          onChange={(_, time) => update({ time })}
        />
      </Grid>

      {/* start */}
      <Grid size={3}>
        <Typography variant="body1">{labels?.start ?? "Start"}</Typography>
      </Grid>
      <Grid size={2.5}>
        <TextField
          value={item.start ?? ""}
          variant="standard"
          type="number"
          fullWidth
          onChange={(e) => {
            const start = filterNumber(e.target.value);
            if (start !== undefined && start < 0) return;
            update({ start });
          }}
        />
      </Grid>
      <Grid size={6.5} sx={{ pl: 0.5 }}>
        <Slider
          value={item.start}
          min={settings?.start?.min}
          max={settings?.start?.max}
          size="small"
          onChange={(_, start) => update({ start })}
        />
      </Grid>

      {/* ticks */}
      <Grid size={3}>
        <Typography variant="body1">{labels?.ticks ?? "Ticks"}</Typography>
      </Grid>
      <Grid size={2.5}>
        <TextField
          value={item.ticks ?? ""}
          variant="standard"
          type="number"
          fullWidth
          onChange={(e) => {
            const ticks = filterNumber(e.target.value);
            if (ticks !== undefined && ticks < 1) return;
            update({ ticks });
          }}
        />
      </Grid>
      <Grid size={6.5} sx={{ pl: 0.5 }}>
        <Slider
          value={item.ticks}
          min={settings?.ticks?.min}
          max={settings?.ticks?.max}
          size="small"
          onChange={(_, ticks) => update({ ticks })}
        />
      </Grid>

      {/* key */}
      <Grid size={3}>
        <Typography variant="body1">{labels?.key ?? "Key"}</Typography>
      </Grid>
      <Grid size={9}>
        <Select
          value={item.key ?? ""}
          onChange={(e) => update({ key: filterNumber(e.target.value) })}
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
        <Typography variant="body1">{labels?.tier ?? "Tier"}</Typography>
      </Grid>
      <Grid size={9}>
        <Select
          value={item.tier ?? 0}
          onChange={(e) => update({ tier: filterNumber(e.target.value) })}
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
        <Typography variant="body1">
          {labels?.highlighted ?? "Highlighted"}
        </Typography>
      </Grid>
      <Grid size={9}>
        <Checkbox
          checked={item.highlighted ?? false}
          size="small"
          sx={{ p: 0, display: "inline-block" }}
          onChange={(e) =>
            update({ highlighted: e.target.checked ? true : undefined })
          }
        />
      </Grid>

      {/* notes */}
      <Grid size={3}>
        <Typography variant="body1">{labels?.notes ?? "Notes"}</Typography>
      </Grid>
      <Grid size={9}>
        <TextField
          value={item.notes ?? ""}
          variant="standard"
          multiline
          fullWidth
          onChange={(e) =>
            update({ notes: filterString(e.currentTarget.value) })
          }
        />
      </Grid>
    </Grid>
  );
}

function filterString(str: string) {
  return str === "" ? undefined : str;
}

function filterNumber(value: string | number) {
  if (value === "") return undefined;
  const num = Number(value);
  return isNaN(num) ? undefined : num;
}
