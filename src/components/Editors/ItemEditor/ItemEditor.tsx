import { useState } from "react";
import { ItemForm } from "../ui/ItemForm/ItemForm";
import { useDebounce } from "@/generics/hooks/useDebounce";
import { atomsSelectedNode } from "@/models/hooks/atomSelectedNode";
import { useAtomValue, useSetAtom } from "jotai";
import { validateItemNode } from "@/models/validators/validateItemNode";
import { atomReferenceJson } from "@/models/hooks/atomReferenceJson";

export function ItemEditor() {
  // フック
  const { itemNode } = useAtomValue(atomsSelectedNode.nodeValue);
  const updateByItemDataAsync = useSetAtom(
    atomsSelectedNode.updateItemNodeAsync,
  );
  const setReferencePathAsync = useSetAtom(atomReferenceJson.setPathAsync);
  const referenceData = useAtomValue(atomReferenceJson.value);
  const [nodeId, setNodeId] = useState<string>();
  const [item, setItem] = useState<ItemEntry>();
  const debouncedUpdate = useDebounce(updateByItemDataAsync).debounced;

  if (itemNode?.nodeId !== nodeId) {
    setNodeId(itemNode?.nodeId);
    setItem(itemNode?.entry);
  }
  if (!itemNode || !item || !referenceData) return null;

  const referenceSelected =
    itemNode.isReference &&
    referenceData.highlighted_paths.includes(itemNode.entry.path ?? "");

  const update = async (diff: Partial<ItemEntry>) => {
    if (itemNode.isReference) {
      await setReferencePathAsync(
        itemNode.entry.path ?? "",
        diff.highlighted ? "add" : "remove",
      );
      return;
    }

    const newItem = { ...item, ...diff };
    validateItemNode.modifyItemNode(newItem);
    setItem(newItem);

    // 更新の可否をチェック
    const canOverwrite = validateItemNode.canOverwrite(newItem, itemNode);
    if (!canOverwrite) return;

    // 更新
    const delays = ["title", "path", "start", "ticks", "notes"].some((key) =>
      Object.hasOwn(diff, key),
    );
    debouncedUpdate(delays ? 1000 : 0, newItem, itemNode);
  };

  return (
    <ItemForm
      item={item}
      onChange={update}
      referenceSelected={referenceSelected}
    />
  );
}
