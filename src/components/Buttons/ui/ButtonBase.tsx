import { Button } from "@mui/material";
import { useAppSettingsValue } from "../../../jotai/useAppSettings";

export function ButtonBase({
  type,
  onClick,
}: {
  type: keyof Required<AppSettings>["buttons"];
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) {
  const settings = useAppSettingsValue();
  const icon = settings.buttons?.[type];

  if (!icon) return null;
  return (
    <Button onClick={onClick} sx={{ minWidth: 0, fontSize: "1.5rem" }}>
      {icon}
    </Button>
  );
}
