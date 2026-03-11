import { useState } from "react";
import { ItemForm } from "../../ui/ItemForm/ItemForm";
import { Button, Stack } from "@mui/material";
import { atomsSelectedNode } from "@/models/hooks/atomSelectedNode";
import { useAtomValue, useSetAtom } from "jotai";
import { validateItemNode } from "@/models/validators/validateItemNode";

const defaultItem: ItemEntry = { type: "item" };

export function AddItem() {
  const folder = useAtomValue(atomsSelectedNode.nodeValue).folderNode;
  const addItemAsync = useSetAtom(atomsSelectedNode.updateFolderNodeAsync);
  const [item, setItem] = useState<ItemEntry>(defaultItem);

  if (!folder) return null;

  const canAdd = validateItemNode.canAddItem(item, folder);

  const updateItem = (diff: Partial<ItemEntry>) => {
    const newItem = { ...item, ...diff };
    validateItemNode.modifyItemNode(newItem);
    setItem(newItem);
  };

  const reset = () => setItem(defaultItem);

  const addItem = async () => {
    if (!canAdd) return;
    await addItemAsync({ newItem: item }, folder);
    reset();
  };

  return (
    <Stack spacing={2}>
      <ItemForm item={item} onChange={updateItem} />
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
