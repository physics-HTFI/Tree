import { useModelEnabled } from "../../../jotai/useModelEnabled";
import { ButtonBase } from "../ui/ButtonBase";

export function ModelEnableButton() {
  const [modelEnabled, setModelEnabled] = useModelEnabled();
  return (
    <ButtonBase
      type={modelEnabled ? "model_enabled" : "model_disabled"}
      onClick={() => setModelEnabled(!modelEnabled)}
    />
  );
}
