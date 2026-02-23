import {
  Checkbox,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAppSettingsValue } from "../../../jotai/useAppSettings";
import { toTimeString } from "./utils/toTimeString";
import { getWheeledNumber } from "./utils/getWheeledNumber";
import { CloseButton } from "./ui/CloseButton";
import { filterString } from "../../../utils/filterString";

export function ItemForm({
  item,
  onChange,
}: {
  item: ItemData | null;
  onChange: (itemDiff: Partial<ItemData>) => void;
}) {
  // フック
  const settings = useAppSettingsValue();

  const labels = settings.labels;
  if (!item) return null;
  const isUrl = item.path?.startsWith("https://") ?? false;
  return (
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
        <Typography variant="body1">{labels?.title ?? "Title"}</Typography>
      </Grid>
      <Grid size={9}>
        <TextField
          value={item.title ?? ""}
          variant="standard"
          fullWidth
          onChange={(e) =>
            onChange({ title: filterString(e.currentTarget.value) })
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
            onChange({ path: filterString(e.currentTarget.value) });
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
            onChange({ tier: filterNumber(e.target.value, false) })
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
            onChange({ time: getWheeledNumber("time", item, settings, e) })
          }
        />
        <CloseButton onClick={() => onChange({ time: undefined })} />
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
            onChange({ start: getWheeledNumber("start", item, settings, e) })
          }
        />
        <CloseButton onClick={() => onChange({ start: undefined })} />
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
            onChange({ ticks: getWheeledNumber("ticks", item, settings, e) })
          }
        />
        <CloseButton onClick={() => onChange({ ticks: undefined })} />
      </Grid>

      {/* key */}
      <Grid size={3}>
        <Typography variant="body1">{labels?.key ?? "Key"}</Typography>
      </Grid>
      <Grid size={9}>
        <Select
          value={item.key ?? ""}
          onChange={(e) => onChange({ key: filterNumber(e.target.value) })}
          variant="standard"
          sx={{ width: 90 }}
        >
          {settings?.keys?.map((key, index) => (
            <MenuItem key={index} value={key.key}>
              {key.label ?? "---"}
            </MenuItem>
          ))}
        </Select>
        <CloseButton onClick={() => onChange({ key: undefined })} />
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
            onChange({ highlighted: e.target.checked ? true : undefined })
          }
        />
      </Grid>

      {/* pop */}
      <Grid size={3}>
        <Typography variant="body1">{labels?.pop ?? "Pop"}</Typography>
      </Grid>
      <Grid size={9}>
        <Checkbox
          checked={isUrl || (item.pop ?? false)}
          disabled={isUrl}
          size="small"
          sx={{ p: 0, display: "inline-block" }}
          onChange={(e) => {
            if (isUrl) return;
            onChange({ pop: e.target.checked ? true : undefined });
          }}
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
              onChange({ notes: filterString(e.currentTarget.value) })
            }
          />
          <CloseButton onClick={() => onChange({ notes: undefined })} />
        </Stack>
      </Grid>
    </Grid>
  );
}

/** 文字列を数値に変換する。できない場合はundefined。 */
function filterNumber(value: string | number, allowZero = true) {
  if (value === "") return undefined;
  const num = Number(value);
  if (!allowZero && num === 0) return undefined;
  return isNaN(num) ? undefined : num;
}
