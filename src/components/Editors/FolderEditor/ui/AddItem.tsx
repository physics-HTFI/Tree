import { useState } from "react";
import { ItemForm } from "../../ui/ItemForm/ItemForm";
import { Button, Stack } from "@mui/material";
import { atomsSelected } from "@/jotai/atomSelected";
import { useAtomValue, useSetAtom } from "jotai";

const defaultItem: ItemEntry = { type: "item" };

export function AddItem() {
  const folder = useAtomValue(atomsSelected.nodeValue).selectedFolderNode;
  const addItemAsync = useSetAtom(atomsSelected.addItemEntryAsync);
  const [item, setItem] = useState<ItemEntry>(defaultItem);

  if (!folder?.handle) return null;

  const canAdd = Boolean(item.title);

  const update = (diff: Partial<ItemEntry>) => {
    const newItem = { ...item, ...diff };
    setItem(newItem);
  };

  const reset = () => setItem(defaultItem);

  const addItem = async () => {
    if (!canAdd) return;
    await addItemAsync(item);
    reset();
  };

  return (
    <Stack spacing={2}>
      <ItemForm item={item} onChange={update} />
      <Stack direction="row" spacing={1} justifyContent="flex-end">
        <Button variant="contained" onClick={addItem} disabled={!canAdd}>
          追加
        </Button>
        <Button variant="outlined" onClick={reset}>
          リセット
        </Button>
      </Stack>
    </Stack>
  );
}
