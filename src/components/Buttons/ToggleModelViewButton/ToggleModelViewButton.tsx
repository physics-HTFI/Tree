import { useModelViewEnabled } from "../../../jotai/useModelViewEnabled";
import { ButtonBase } from "../ui/ButtonBase";

export function ToggleModelViewButton() {
  const [modelEnabled, setModelEnabled] = useModelViewEnabled();
  return (
    <ButtonBase
      type={modelEnabled ? "model_enabled" : "model_disabled"}
      onClick={() => setModelEnabled(!modelEnabled)}
    />
  );
}
