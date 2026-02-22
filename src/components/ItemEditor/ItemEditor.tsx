import { useSelectedItemNodeValue } from "../../jotai/useSelectedTreeNode";
import { useUpdateFolderNode } from "../../jotai/useTreeItems";
import { useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { ItemForm } from "../share/ItemForm/ItemForm";

export function ItemEditor() {
  // フック
  const selectedNode = useSelectedItemNodeValue();
  const { updateByItemDataAsync: updateFolderNodeAsync } = useUpdateFolderNode(
    selectedNode?.nodeId,
  );
  const [nodeId, setNodeId] = useState<string>();
  const [item, setItem] = useState<ItemData>();
  const { debounced: debouncedUpdate } = useDebounce(updateFolderNodeAsync);

  if (selectedNode?.nodeId !== nodeId) {
    setNodeId(selectedNode?.nodeId);
    setItem(selectedNode?.data);
  }
  if (!item) return null;

  const update = (diff: ItemData) => {
    const newItem = { ...item, ...diff };
    setItem(newItem);
    const keysToDelay: (keyof ItemData)[] = [
      "title",
      "path",
      "time",
      "start",
      "ticks",
      "notes",
    ];
    const delay = keysToDelay.some((key) => diff[key] !== undefined)
      ? 1000
      : 100;
    debouncedUpdate(newItem, delay);
  };

  return <ItemForm item={item} onChange={update} />;
}
