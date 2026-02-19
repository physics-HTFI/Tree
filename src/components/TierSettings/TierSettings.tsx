import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
  Typography,
} from "@mui/material";
import { useAppSettings } from "./_useAppSettings";

export function TierSettings() {
  // フック
  const { settings, setSettingsAsync } = useAppSettings();

  const tiers = settings.tiers ?? [];

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
            <Label
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

function Label({
  tier,
  index,
  onChange,
}: {
  tier: TierSettings;
  index: number;
  onChange: (tier: TierSettings, index: number) => void;
}) {
  tier = {
    checked: true,
    color: "black",
    label: "---",
    underline: false,
    ...tier,
  };

  const handleChange = () => {
    onChange({ ...tier, checked: !tier.checked }, index);
  };

  return (
    <FormControlLabel
      label={
        <Typography
          variant="body1"
          sx={{
            color: tier.color,
            textDecoration: tier.underline ? "underline" : undefined,
          }}
        >
          {tier.label}
        </Typography>
      }
      control={
        <Checkbox
          checked={tier.checked}
          onChange={handleChange}
          size="small"
          sx={{ p: 0.5 }}
        />
      }
    />
  );
}
