import { useCallback, useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import { useTick } from "./useTick";
import { Box, Card, CardContent, ClickAwayListener } from "@mui/material";
import { atomSettingsJsonValue } from "@/jotai/atomSettingsJson";
import { useAtomValue } from "jotai";
import { atomsSelected } from "@/jotai/atomSelected";

export function TickPanel({ onClose }: { onClose: () => void }) {
  const selectedItem = useAtomValue(atomsSelected.nodeValue).selectedItemNode;
  const settings = useAtomValue(atomSettingsJsonValue);
  const defaultTicks = settings.defaults?.ticks;
  const [item, setItem] = useState<ItemNode>();
  const [ticks, setTicks] = useState(defaultTicks);
  const [isPlaying, setIsPlaying] = useState(false);
  const { tick } = useTick();

  if (item !== selectedItem) {
    setItem(selectedItem);
    setTicks(selectedItem?.entry?.ticks ?? defaultTicks);
  }

  useEffect(() => {
    if (!isPlaying || !ticks) return;
    const id = setInterval(tick, (60 / ticks) * 1000);
    return () => clearInterval(id);
  }, [isPlaying, ticks, tick]);

  const handleToggle = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      tick();
      setIsPlaying(true);
    }
  }, [isPlaying, tick]);

  if (!ticks) return null;
  return (
    <ClickAwayListener onClickAway={onClose}>
      <Card
        sx={{ width: 400 }}
        onWheel={(e) => setTicks(Math.max(1, ticks + (e.deltaY < 0 ? -1 : 1)))}
      >
        <CardContent>
          <Stack spacing={2} alignItems="center" sx={{ py: 1 }}>
            <Typography variant="h2">{ticks}</Typography>
            <Slider
              value={ticks}
              onChange={(_, value) => setTicks(value)}
              min={40}
              max={240}
              step={1}
              marks={[50, 100, 150, 200].map((v) => ({
                value: v,
                label: v.toString(),
              }))}
            />
            <Box sx={{ pt: 3 }}>
              <IconButton
                onClick={handleToggle}
                size="large"
                color={isPlaying ? "error" : "primary"}
                sx={{ border: 2 }}
              >
                {isPlaying ? (
                  <StopIcon sx={{ fontSize: 48 }} />
                ) : (
                  <PlayArrowIcon sx={{ fontSize: 48 }} />
                )}
              </IconButton>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </ClickAwayListener>
  );
}
