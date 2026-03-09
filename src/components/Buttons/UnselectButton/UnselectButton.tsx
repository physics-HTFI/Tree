import { useSetAtom } from "jotai";
import { atomsSelectedNode } from "@/models/hooks/atomSelectedNode";
import { ButtonBase } from "../ui/ButtonBase";

export function UnselectButton() {
  const unselect = useSetAtom(atomsSelectedNode.unselect);
  return <ButtonBase type="close" onClick={unselect} />;
}
