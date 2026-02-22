import { useUnselect } from "../../../jotai/useSelectedTreeNode";
import { ButtonBase } from "../ui/ButtonBase";

export function CloseButton() {
  const { unselect } = useUnselect();
  return <ButtonBase type="close" onClick={unselect} />;
}
