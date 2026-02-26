import { useAtom } from "jotai";
import { atomModelViewEnabled } from "@/jotai/atomModelViewEnabled";
import { ButtonBase } from "../ui/ButtonBase";

export function ToggleModelViewButton() {
  const [modelEnabled, setModelEnabled] = useAtom(atomModelViewEnabled);
  return (
    <ButtonBase
      type={modelEnabled ? "model_enabled" : "model_disabled"}
      onClick={() => setModelEnabled(!modelEnabled)}
    />
  );
}
