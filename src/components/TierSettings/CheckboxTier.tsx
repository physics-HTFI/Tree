import { Checkbox, FormControlLabel, Typography } from "@mui/material";

export function CheckboxTier({
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
