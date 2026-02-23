import { useState } from "react";
import { ItemForm } from "../../share/ItemForm/ItemForm";
import { Button, Stack } from "@mui/material";

const defaultItem: ItemData = {};

export function AddItem({ onAdd }: { onAdd: (item: ItemData) => void }) {
  const [item, setItem] = useState<ItemData>(defaultItem);

  const canAdd = Boolean(item.title);
  const reset = () => setItem(defaultItem);

  const update = (diff: ItemData) => {
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
