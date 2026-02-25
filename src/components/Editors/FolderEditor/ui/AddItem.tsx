import { useState } from "react";
import { ItemForm } from "../../ui/ItemForm/ItemForm";
import { Button, Stack } from "@mui/material";

const defaultItem: ItemEntry = { type: "item" };

export function AddItem({ onAdd }: { onAdd: (item: ItemEntry) => void }) {
  const [item, setItem] = useState<ItemEntry>(defaultItem);

  const canAdd = Boolean(item.title);
  const reset = () => setItem(defaultItem);

  const update = (diff: Partial<ItemEntry>) => {
    const newItem = { ...item, ...diff };
    setItem(newItem);
  };

  return (
    <Stack spacing={2}>
      <ItemForm item={item} onChange={update} />
      <Stack direction="row" spacing={1} justifyContent="flex-end">
        <Button
          variant="contained"
          onClick={() => {
            if (!canAdd) return;
            onAdd(item);
            reset();
          }}
          disabled={!canAdd}
        >
          追加
        </Button>
        <Button variant="outlined" onClick={reset}>
          リセット
        </Button>
      </Stack>
    </Stack>
  );
}
