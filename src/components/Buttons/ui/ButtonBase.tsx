import { atomConsts } from "@/models/hooks/atomConsts";
import { Button } from "@mui/material";
import { useAtomValue } from "jotai";

export function ButtonBase({
  type,
  onClick,
}: {
  type: keyof Required<SettingsJson>["buttons"];
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) {
  const settings = useAtomValue(atomConsts.settingsJsonValue);
  const icon = settings?.buttons?.[type];

  if (!icon) return null;
  return (
    <Button onClick={onClick} sx={{ minWidth: 0, fontSize: "1.5rem" }}>
      {icon}
    </Button>
  );
}
