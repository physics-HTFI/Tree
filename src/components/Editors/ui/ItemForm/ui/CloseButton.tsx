import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";

export function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <IconButton
      size="small"
      sx={{
        visibility: "hidden",
        "*:hover > &": {
          visibility: "visible",
        },
      }}
      onClick={onClick}
    >
      <Close fontSize="small" />
    </IconButton>
  );
}
