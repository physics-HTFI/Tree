import { useSelectedItemNodeValue } from "../../jotai/useSelectedTreeNode";
import { useUpdateFolderNode } from "../../jotai/useTreeItems";
import { useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { ItemForm } from "../share/ItemForm/ItemForm";

export function ItemEditor() {
  // フック
  const selectedNode = useSelectedItemNodeValue();
  const { updateByItemDataAsync } = useUpdateFolderNode();
  const [nodeId, setNodeId] = useState<string>();
  const [item, setItem] = useState<ItemData>();
  const { debounced: debouncedUpdate } = useDebounce(updateByItemDataAsync);

  if (selectedNode?.nodeId !== nodeId) {
    setNodeId(selectedNode?.nodeId);
    setItem(selectedNode?.data);
  }
  if (!selectedNode || !item) return null;

  const update = async (diff: Partial<ItemData>) => {
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
    const delays = keysToDelay.some((key) => diff[key] !== undefined);
    if (delays) {
      debouncedUpdate({ ...selectedNode, data: newItem }, 1000);
    } else {
      await updateByItemDataAsync({ ...selectedNode, data: newItem });
    }
  };

  return <ItemForm item={item} onChange={update} />;
}
