import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useUnselect } from "../../jotai/useSelectedTreeNode";

export function CloseButton() {
  const { unselect } = useUnselect();
  return (
    <IconButton color="primary" onClick={unselect}>
      <Close />
    </IconButton>
  );
}
