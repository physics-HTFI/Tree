import type { TierSettings } from "@/types/SettingsJson";
import { Checkbox, FormControlLabel, Typography } from "@mui/material";

export function CheckboxTier({
  checked,
  tier,
  onChange,
}: {
  checked: boolean;
  tier: TierSettings;
  onChange: (checked: boolean) => void;
}) {
  tier = {
    color: "black",
    label: "---",
    underline: false,
    ...tier,
  };

  const handleChange = () => {
    onChange(!checked);
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
          checked={checked}
          onChange={handleChange}
          size="small"
          sx={{ p: 0.5 }}
        />
      }
    />
  );
}
