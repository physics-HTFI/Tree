import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import { useSettings } from "./_useSettings";

export function Tiers() {
  // フック
  const { settings, setSettingsAsync } = useSettings();

  const tiers = settings.tiers ?? [];

  const updateSettingsAsync = async (tier: Tier, index: number) => {
    const newTiers = [...tiers];
    newTiers[index] = tier;
    await setSettingsAsync({ ...settings, tiers: newTiers });
  };

  return (
    <Box sx={{ position: "fixed", top: 4, right: 4 }}>
      <FormGroup>
        <Count count={123} />
        {[...tiers].reverse().map((tier, i) => (
          <Label
            key={`${i}: ${tier.label}`}
            tier={tier}
            index={i}
            onChange={updateSettingsAsync}
          />
        ))}
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
  tier: Tier;
  index: number;
  onChange: (tier: Tier, index: number) => void;
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
