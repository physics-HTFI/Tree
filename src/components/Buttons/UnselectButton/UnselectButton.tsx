import { useSetAtom } from "jotai";
import { atomsSelected } from "../../../jotai/share/atomSelected";
import { ButtonBase } from "../ui/ButtonBase";

export function UnselectButton() {
  const unselectAsync = useSetAtom(atomsSelected.unselectAsync);
  return <ButtonBase type="close" onClick={unselectAsync} />;
}
