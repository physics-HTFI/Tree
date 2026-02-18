import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
  Typography,
} from "@mui/material";
import { useAppSettings } from "./_useAppSettings";

export function Tiers() {
  // フック
  const { settings, setSettingsAsync } = useAppSettings();

  const tiers = settings.tiers ?? [];

  const updateSettingsAsync = async (tier: TierSettings, index: number) => {
    const newTiers = [...tiers];
    newTiers[index] = tier;
    await setSettingsAsync({ ...settings, tiers: newTiers });
  };

  return (
    <Box sx={{ position: "fixed", top: 4, right: 4 }}>
      <FormGroup>
        <Count count={123} />
        <Stack sx={{ flexDirection: "column-reverse" }}>
          {tiers.map((tier, i) => (
            <Label
              key={`${i}: ${tier.label}`}
              tier={tier}
              index={i}
              onChange={updateSettingsAsync}
            />
          ))}
        </Stack>
      </FormGroup>
    </Box>
  );
}

function Count({ count }: { count?: number }) {
  if (count === undefined) return null;
  return (
    <Typography variant="body1" sx={{ borderBottom: "1px solid black", mb: 1 }}>
      {count}
    </Typography>
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
