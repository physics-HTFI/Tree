import { useSetAtom } from "jotai";
import { atomsSelected } from "@/models/hooks/atomSelected";
import { ButtonBase } from "../ui/ButtonBase";

export function UnselectButton() {
  const unselect = useSetAtom(atomsSelected.unselect);
  return <ButtonBase type="close" onClick={unselect} />;
}
