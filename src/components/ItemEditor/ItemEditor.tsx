import {
  Checkbox,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAppSettingsValue } from "../../jotai/useAppSettings";
import { useSelectedItemNodeValue } from "../../jotai/useSelectedTreeNode";
import { useUpdateFolderNode } from "../../jotai/useTreeItems";
import { toTimeString } from "./utils/toTimeString";
import { useState } from "react";
import { useDebounce } from "./useDebounce";
import { getWheeledNumber } from "./utils/getWheeledNumber";
import { CloseButton } from "./ui/CloseButton";

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

  const update = (diff: ItemData, delayed: boolean) => {
    const newItem = { ...item, ...diff };
    setItem(newItem);
    if (delayed) {
      debouncedUpdate(newItem, 1000);
    } else {
      debouncedUpdate(newItem, 100);
    }
  };

  return (
    <Grid
      container
      spacing={1}
      sx={{
        textAlign: "left",
        maxWidth: 300,
        alignItems: "center",
      }}
    >
      {/* title */}
      <Grid size={3}>
        <Typography variant="body1">{labels?.title ?? "Title"}</Typography>
      </Grid>
      <Grid size={9}>
        <TextField
          value={item.title ?? ""}
          variant="standard"
          fullWidth
          onChange={(e) =>
            update({ title: filterString(e.currentTarget.value) }, true)
          }
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
            update({ time: getWheeledNumber("time", item, settings, e) }, true)
          }
        />
        <CloseButton onClick={() => update({ time: undefined }, false)} />
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
              { start: getWheeledNumber("start", item, settings, e) },
              true,
            )
          }
        />
        <CloseButton onClick={() => update({ start: undefined }, false)} />
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
              { ticks: getWheeledNumber("ticks", item, settings, e) },
              true,
            )
          }
        />
        <CloseButton onClick={() => update({ ticks: undefined }, false)} />
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
          sx={{ width: 90 }}
        >
          {settings?.keys?.map((key, index) => (
            <MenuItem key={index} value={key.key}>
              {key.label ?? "---"}
            </MenuItem>
          ))}
        </Select>
        <CloseButton onClick={() => update({ key: undefined }, false)} />
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
        <Stack direction="row" alignItems="center">
          <TextField
            value={item.notes ?? ""}
            variant="standard"
            multiline
            fullWidth
            onChange={(e) =>
              update({ notes: filterString(e.currentTarget.value) }, true)
            }
          />
          <CloseButton onClick={() => update({ notes: undefined }, false)} />
        </Stack>
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
