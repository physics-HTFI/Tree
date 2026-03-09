import { FormGroup, Stack } from "@mui/material";
import { CheckboxTier } from "./ui/CheckboxTier";
import { Counter } from "./ui/Counter";
import { useAtom, useAtomValue } from "jotai";
import { atomConsts } from "@/models/hooks/atomConsts";
import { atomOptions } from "@/models/hooks/atomOptions";

export function TierEditor() {
  // フック
  const settings = useAtomValue(atomConsts.settingsJsonValue);
  const [hiddenTiers, setHiddenTiers] = useAtom(atomOptions.hiddenTiers);

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
