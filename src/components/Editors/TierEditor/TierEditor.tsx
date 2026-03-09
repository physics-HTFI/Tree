import { FormGroup, Stack } from "@mui/material";
import { CheckboxTier } from "./ui/CheckboxTier";
import { Counter } from "./ui/Counter";
import { useAtom, useAtomValue } from "jotai";
import { atomHiddenTiers } from "@/jotai/atomHiddenTiers";
import { atomConstants } from "@/jotai/atomConstants";

export function TierEditor() {
  // フック
  const settings = useAtomValue(atomConstants.settingsJsonValue);
  const [hiddenTiers, setHiddenTiers] = useAtom(atomHiddenTiers);

  const tiers = settings?.tiers;
  if (!tiers) return null;

  return (
    <Stack direction="row">
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
