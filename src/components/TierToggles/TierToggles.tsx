import { FormGroup, Stack } from "@mui/material";
import { CheckboxTier } from "./CheckboxTier";
import { Counter } from "./Counter";
import { useHiddenTiers } from "../../jotai/useHiddenTiers";
import { useAppSettingsValue } from "./_useAppSettings";

export function TierToggles() {
  // フック
  const settings = useAppSettingsValue();
  const [hiddenTiers, setHiddenTiers] = useHiddenTiers();

  const tiers = settings.tiers;
  if (!tiers) return null;

  return (
    <Stack sx={{ position: "fixed", top: 4, right: 4 }}>
      <Counter />
      <FormGroup>
        {tiers
          .map((tier, i) => ({ tier, i }))
          ?.reverse()
          ?.map((v) => (
            <CheckboxTier
              checked={!hiddenTiers.has(v.i)}
              key={`${v.i}: ${v.tier.label}`}
              tier={v.tier}
              onChange={(checked) => {
                if (checked) {
                  hiddenTiers.delete(v.i);
                } else {
                  hiddenTiers.add(v.i);
                }
                setHiddenTiers(new Set(hiddenTiers));
              }}
            />
          ))}
      </FormGroup>
    </Stack>
  );
}
