import { FormGroup, Stack, Typography } from "@mui/material";
import { useAppSettings } from "./_useAppSettings";
import { StyledCheckbox } from "./StyledCheckbox";

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
      <Typography
        variant="body1"
        sx={{ borderBottom: "1px solid black", mb: 1, textAlign: "center" }}
      >
        {123}
      </Typography>
      <FormGroup>
        {tiers
          .map((tier, i) => ({ tier, i }))
          ?.reverse()
          ?.map((v) => (
            <StyledCheckbox
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
