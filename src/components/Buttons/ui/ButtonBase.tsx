import { Button } from "@mui/material";
import { atomAppSettingsValue } from "../../../jotai/share/atomAppSettings";
import { useAtomValue } from "jotai";

export function ButtonBase({
  type,
  onClick,
}: {
  type: keyof Required<AppSettings>["buttons"];
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) {
  const settings = useAtomValue(atomAppSettingsValue);
  const icon = settings.buttons?.[type];

  if (!icon) return null;
  return (
    <Button onClick={onClick} sx={{ minWidth: 0, fontSize: "1.5rem" }}>
      {icon}
    </Button>
  );
}
