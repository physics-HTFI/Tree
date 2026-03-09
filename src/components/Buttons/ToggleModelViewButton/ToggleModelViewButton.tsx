import { useAtom } from "jotai";
import { ButtonBase } from "../ui/ButtonBase";
import { atomOptions } from "@/models/hooks/atomOptions";

export function ToggleModelViewButton() {
  const [modelEnabled, setModelEnabled] = useAtom(atomOptions.modelViewEnabled);
  return (
    <ButtonBase
      type={modelEnabled ? "model_enabled" : "model_disabled"}
      onClick={() => setModelEnabled(!modelEnabled)}
    />
  );
}
