import {
  Checkbox,
  Grid,
  IconButton,
  MenuItem,
  Select,
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
import { useDebounce } from "./useDebounce";

export function ItemEditor() {
  // フック
  const settings = useAppSettingsValue();
  const selectedNode = useSelectedItemNodeValue();
  const { updateFolderNodeAsync } = useUpdateFolderNode(selectedNode?.nodeId);
  const [nodeId, setNodeId] = useState<string>();
  const [item, setItem] = useState<ItemData>();
  const { debounced: debouncedUpdate } = useDebounce(updateFolderNodeAsync);

  if (selectedNode?.nodeId !== nodeId) {
    setNodeId(selectedNode?.nodeId);
    setItem(selectedNode?.data);
  }
  if (!item) return null;

  const labels = settings.labels?.file;
  const searchUrl = getSearchUrl(settings, item);

  const update = (diff: ItemData, delayed: boolean) => {
    const newItem = { ...item, ...diff };
    setItem(newItem);
    if (delayed) {
      debouncedUpdate(newItem, 1000);
    } else {
      debouncedUpdate(newItem, 0);
    }
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
            update({ title: filterString(e.currentTarget.value) }, true);
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
            update({ path: filterString(e.currentTarget.value) }, true);
          }}
        />
      </Grid>

      {/* tier */}
      <Grid size={3}>
        <Typography variant="body1">{labels?.tier ?? "Tier"}</Typography>
      </Grid>
      <Grid size={9}>
        <Select
          value={item.tier ?? 0}
          onChange={(e) =>
            update({ tier: filterNumber(e.target.value) }, false)
          }
          variant="standard"
          fullWidth
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

      {/* time */}
      <Grid size={3}>
        <Typography variant="body1">{labels?.time ?? "Time"}</Typography>
      </Grid>
      <Grid size={9}>
        <TextField
          value={item.time ? toTimeString(item.time) : ""}
          variant="standard"
          sx={{ width: 60 }}
          onWheel={(e) =>
            update(
              {
                time: getWheeledValue(
                  item.time,
                  settings.defaults.time,
                  10,
                  10,
                  e,
                ),
              },
              true,
            )
          }
        />
      </Grid>

      {/* start */}
      <Grid size={3}>
        <Typography variant="body1">{labels?.start ?? "Start"}</Typography>
      </Grid>
      <Grid size={9}>
        <TextField
          value={item.start ?? ""}
          variant="standard"
          sx={{ width: 60 }}
          onWheel={(e) =>
            update(
              {
                start: getWheeledValue(
                  item.start,
                  settings.defaults.start,
                  0,
                  1,
                  e,
                ),
              },
              true,
            )
          }
        />
      </Grid>

      {/* ticks */}
      <Grid size={3}>
        <Typography variant="body1">{labels?.ticks ?? "Ticks"}</Typography>
      </Grid>
      <Grid size={9}>
        <TextField
          value={item.ticks ?? ""}
          variant="standard"
          sx={{ width: 60 }}
          onWheel={(e) =>
            update(
              {
                ticks: getWheeledValue(
                  item.ticks,
                  settings.defaults.ticks,
                  30,
                  1,
                  e,
                ),
              },
              true,
            )
          }
        />
      </Grid>

      {/* key */}
      <Grid size={3}>
        <Typography variant="body1">{labels?.key ?? "Key"}</Typography>
      </Grid>
      <Grid size={9}>
        <Select
          value={item.key ?? ""}
          onChange={(e) => update({ key: filterNumber(e.target.value) }, false)}
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

      {/* highlighted */}
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
            update({ highlighted: e.target.checked ? true : undefined }, false)
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
            update({ notes: filterString(e.currentTarget.value) }, true)
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

function getWheeledValue(
  value: number | undefined,
  defaultValue: number | undefined,
  min: number,
  delta: number,
  event: React.WheelEvent,
) {
  if (event.target !== document.activeElement) return value; // 未フォーカス時は無視する（誤変更を防ぐため）
  if (value === undefined) return defaultValue ?? min;
  return Math.max(min, value + (event.deltaY > 0 ? 1 : -1) * delta);
}
