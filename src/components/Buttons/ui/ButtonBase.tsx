import { Button } from "@mui/material";
import { atomSettingsJsonValue } from "@/jotai/atomSettingsJson";
import { useAtomValue } from "jotai";

export function ButtonBase({
  type,
  onClick,
}: {
  type: keyof Required<SettingsJson>["buttons"];
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) {
  const settings = useAtomValue(atomSettingsJsonValue);
  const icon = settings?.buttons?.[type];

  if (!icon) return null;
  return (
    <Button onClick={onClick} sx={{ minWidth: 0, fontSize: "1.5rem" }}>
      {icon}
    </Button>
  );
}
