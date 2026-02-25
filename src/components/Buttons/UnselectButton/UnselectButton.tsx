import { useSelected } from "../../../jotai/useSelected";
import { ButtonBase } from "../ui/ButtonBase";

export function UnselectButton() {
  const unselectAsync = useSelected.useUnselectAsync();
  return <ButtonBase type="close" onClick={unselectAsync} />;
}
