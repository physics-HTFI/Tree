import { useCallback, useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import { useTick } from "./useTick";

export function TickDialog({
  open,
  onClose,
  defaultBpm,
}: {
  open: boolean;
  onClose: () => void;
  defaultBpm?: number;
}) {
  const [bpm, setBpm] = useState(defaultBpm ?? 120);
  const [isPlaying, setIsPlaying] = useState(false);
  const { tick } = useTick();

  const [prevDefaultBpm, setPrevDefaultBpm] = useState(defaultBpm);
  if (defaultBpm != null && defaultBpm !== prevDefaultBpm) {
    setPrevDefaultBpm(defaultBpm);
    setBpm(defaultBpm);
  }

  const handleClose = () => {
    setIsPlaying(false);
    onClose();
  };

  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(tick, (60 / bpm) * 1000);
    return () => clearInterval(id);
  }, [isPlaying, bpm, tick]);

  const handleToggle = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      tick();
      setIsPlaying(true);
    }
  }, [isPlaying, tick]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogContent>
        <Stack spacing={2} alignItems="center" sx={{ py: 2 }}>
          <Typography variant="h2">{bpm}</Typography>
          <Slider
            value={bpm}
            onChange={(_, value) => setBpm(value as number)}
            min={40}
            max={240}
            step={1}
          />
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
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
