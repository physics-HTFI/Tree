import { useState } from "react";
import { ItemForm } from "../ui/ItemForm/ItemForm";
import { useDebounce } from "@/generics/hooks/useDebounce";
import { atomsSelected } from "@/jotai/atomSelected";
import { useAtomValue, useSetAtom } from "jotai";

export function ItemEditor() {
  // フック
  const { selectedItemNode } = useAtomValue(atomsSelected.nodeValue);
  const updateByItemDataAsync = useSetAtom(atomsSelected.setItemNodeAsync);
  const [nodeId, setNodeId] = useState<string>();
  const [item, setItem] = useState<ItemEntry>();
  const { debounced: debouncedUpdate } = useDebounce(updateByItemDataAsync);

  if (selectedItemNode?.nodeId !== nodeId) {
    setNodeId(selectedItemNode?.nodeId);
    setItem(selectedItemNode?.entry);
  }
  if (!selectedItemNode || !item) return null;

  const update = async (diff: Partial<ItemEntry>) => {
    const newItem = { ...item, ...diff };
    setItem(newItem);
    const keysToDelay: (keyof ItemEntry)[] = [
      "title",
      "path",
      "start",
      "ticks",
      "notes",
    ];
    const delays = keysToDelay.some((key) => diff[key] !== undefined);
    if (delays) {
      debouncedUpdate(newItem, 1000);
    } else {
      await updateByItemDataAsync(newItem);
    }
  };

  return <ItemForm item={item} onChange={update} />;
}
