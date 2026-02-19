import { FormGroup, Stack } from "@mui/material";
import { useAppSettings } from "./_useAppSettings";
import { CheckboxTier } from "./CheckboxTier";
import { Counter } from "./Counter";

export function TierSettings() {
  // フック
  const { settings, setSettingsAsync } = useAppSettings();

  const tiers = settings.tiers;
  if (!tiers) return null;

  const updateSettingsAsync = async (tier: TierSettings, index: number) => {
    const newTiers = [...tiers];
    newTiers[index] = tier;
    await setSettingsAsync({ ...settings, tiers: newTiers });
  };

  return (
    <Stack sx={{ position: "fixed", top: 4, right: 4 }}>
      <Counter />
      <FormGroup>
        {tiers
          .map((tier, i) => ({ tier, i }))
          ?.reverse()
          ?.map((v) => (
            <CheckboxTier
              key={`${v.i}: ${v.tier.label}`}
              tier={v.tier}
              index={v.i}
              onChange={updateSettingsAsync}
            />
          ))}
      </FormGroup>
    </Stack>
  );
}
