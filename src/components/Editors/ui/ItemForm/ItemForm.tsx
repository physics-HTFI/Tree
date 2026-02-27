import {
  Checkbox,
  Grid,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { getWheeledNumber } from "./utils/getWheeledNumber";
import { CloseButton } from "./ui/CloseButton";
import { usePreventScroll } from "./hooks/usePreventScroll";
import { Header } from "./ui/Header";
import { atomAppSettingsValue } from "@/jotai/atomAppSettings";
import { useAtomValue } from "jotai";
import { TextField } from "@/components/share/TextField";
import { modifierItemNode } from "@/modifiers/modifierItemNode";

export function ItemForm({
  item,
  onChange,
}: {
  item: ItemEntry | null;
  onChange: (itemDiff: Partial<ItemEntry>) => void;
}) {
  // フック
  const settings = useAtomValue(atomAppSettingsValue);
  const ref = usePreventScroll();

  const labels = settings.labels;
  if (!item) return null;
  const isUrl = modifierItemNode.isUrl(item);
  return (
    <Grid
      container
      rowSpacing={1}
      columnSpacing={2}
      ref={ref}
      sx={{
        textAlign: "left",
        alignItems: "baseline",
      }}
    >
      {/* title */}
      <Grid size={3}>
        <Header title={labels?.title ?? "Title"} />
      </Grid>
      <Grid size={9}>
        <TextField
          value={item.title}
          onChange={(value) => onChange({ title: value })}
        />
      </Grid>

      {/* path */}
      <Grid size={3}>
        <Header title={labels?.path ?? "Path"} />
      </Grid>
      <Grid size={9}>
        <TextField
          value={item.path}
          onChange={(value) => {
            const regexp = new RegExp(
              settings.expressions?.search_id ?? "(?!)",
            ); // "(?!)" は何にもマッチしない
            const { id, start } = value.match(regexp)?.groups ?? {};
            onChange({
              path: id ?? value,
              start: toNumber(start),
            });
          }}
        />
      </Grid>

      {/* tier */}
      <Grid size={3}>
        <Header title={labels?.tier ?? "Tier"} />
      </Grid>
      <Grid size={9}>
        <Select
          value={item.tier ?? 0}
          onChange={(e) => onChange({ tier: toNumber(e.target.value) })}
          variant="standard"
          size="small"
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

      {/* start */}
      <Grid size={3}>
        <Header title={labels?.start ?? "Start"} />
      </Grid>
      <Grid size={9}>
        <TextField
          value={item.start}
          sx={{ width: 60 }}
          onWheel={(e) =>
            onChange({ start: getWheeledNumber("start", item, settings, e) })
          }
        />
        <CloseButton onClick={() => onChange({ start: undefined })} />
      </Grid>

      {/* ticks */}
      <Grid size={3}>
        <Header title={labels?.ticks ?? "Ticks"} />
      </Grid>
      <Grid size={9}>
        <TextField
          value={item.ticks}
          sx={{ width: 60 }}
          onWheel={(e) =>
            onChange({ ticks: getWheeledNumber("ticks", item, settings, e) })
          }
        />
        <CloseButton onClick={() => onChange({ ticks: undefined })} />
      </Grid>

      {/* key */}
      <Grid size={3}>
        <Header title={labels?.key ?? "Key"} />
      </Grid>
      <Grid size={9}>
        <Select
          value={item.key ?? ""}
          onChange={(e) => onChange({ key: toNumber(e.target.value) })}
          variant="standard"
          size="small"
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

      {/* speed */}
      <Grid size={3}>
        <Header title={labels?.speed ?? "Speed"} />
      </Grid>
      <Grid size={9}>
        <Select
          value={item.speed ?? ""}
          onChange={(e) => onChange({ speed: toNumber(e.target.value) })}
          variant="standard"
          sx={{ width: 90 }}
          size="small"
        >
          {settings?.speeds?.map((speed, index) => (
            <MenuItem key={index} value={speed.speed}>
              {speed.label ?? "---"}
            </MenuItem>
          ))}
        </Select>
        <CloseButton onClick={() => onChange({ speed: undefined })} />
      </Grid>

      {/* highlighted */}
      <Grid size={3}>
        <Header title={labels?.highlighted ?? "Highlighted"} />
      </Grid>
      <Grid size={9}>
        <Checkbox
          checked={item.highlighted || false}
          size="small"
          sx={{ p: 0, display: "inline-block" }}
          onChange={(e) => onChange({ highlighted: e.target.checked })}
        />
      </Grid>

      {/* window */}
      <Grid size={3}>
        <Header title={labels?.window ?? "Window"} />
      </Grid>
      <Grid size={9}>
        <Checkbox
          checked={isUrl || item.window || false}
          disabled={isUrl}
          size="small"
          sx={{ p: 0, display: "inline-block" }}
          onChange={(e) => onChange({ window: e.target.checked })}
        />
      </Grid>

      {/* notes */}
      <Grid size={3}>
        <Header title={labels?.notes ?? "Notes"} />
      </Grid>
      <Grid size={9}>
        <Stack direction="row" alignItems="center">
          <TextField
            value={item.notes}
            multiline
            onChange={(value) => onChange({ notes: value })}
          />
          <CloseButton onClick={() => onChange({ notes: undefined })} />
        </Stack>
      </Grid>
    </Grid>
  );
}

/** 文字列を数値に変換する。できない場合はundefined。 */
function toNumber(value: string | number) {
  if (value === "") return undefined;
  const num = Number(value);
  return isNaN(num) ? undefined : num;
}
