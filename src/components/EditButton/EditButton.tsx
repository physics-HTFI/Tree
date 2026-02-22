import { Button } from "@mui/material";
import { useAppSettingsValue } from "../../jotai/useAppSettings";

export function EditButton() {
  const settings = useAppSettingsValue();
  const icon = settings.buttons?.edit;
  if (!icon) return null;

  const startEdit = () => {};

  return (
    <Button onClick={startEdit} sx={{ minWidth: 0 }}>
      {icon}
    </Button>
  );
}
