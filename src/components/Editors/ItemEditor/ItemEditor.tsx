import { useState } from "react";
import { ItemForm } from "../ui/ItemForm/ItemForm";
import { useDebounce } from "@/generics/hooks/useDebounce";
import { atomsSelectedNode } from "@/models/hooks/atomSelectedNode";
import { useAtomValue, useSetAtom } from "jotai";
import { validateItemNode } from "@/models/validators/validateItemNode";
import { atomReferenceJson } from "@/models/hooks/atomReferenceJson";

export function ItemEditor() {
  // フック
  const { itemNode: selectedItemNode } = useAtomValue(
    atomsSelectedNode.nodeValue,
  );
  const updateByItemDataAsync = useSetAtom(atomsSelectedNode.setItemNodeAsync);
  const setReferencePathAsync = useSetAtom(atomReferenceJson.setPathAsync);
  const referenceData = useAtomValue(atomReferenceJson.value);
  const [nodeId, setNodeId] = useState<string>();
  const [item, setItem] = useState<ItemEntry>();
  const { debounced: debouncedUpdate, cancel: cancelUpdate } = useDebounce(
    updateByItemDataAsync,
  );

  if (selectedItemNode?.nodeId !== nodeId) {
    setNodeId(selectedItemNode?.nodeId);
    setItem(selectedItemNode?.entry);
    cancelUpdate(); // ノード切替時に更新をキャンセル（古いアイテムの変更が新しいアイテムに反映されるのを防ぐ）
  }
  if (!selectedItemNode || !item || !referenceData) return null;

  const referenceSelected =
    selectedItemNode.isReference &&
    referenceData.highlighted_paths.includes(selectedItemNode.entry.path ?? "");

  const update = async (diff: Partial<ItemEntry>) => {
    if (selectedItemNode.isReference) {
      await setReferencePathAsync(
        selectedItemNode.entry.path ?? "",
        diff.highlighted ? "add" : "remove",
      );
      return;
    }

    const newItem = { ...item, ...diff };
    validateItemNode.modifyItemNode(newItem);
    setItem(newItem);

    // 更新の可否をチェック
    const canOverwrite = validateItemNode.canOverwrite(
      newItem,
      selectedItemNode,
    );
    if (!canOverwrite) return;

    // 更新
    const delays = ["title", "path", "start", "ticks", "notes"].some((key) =>
      Object.hasOwn(diff, key),
    );
    debouncedUpdate(newItem, delays ? 1000 : 10);
  };

  return (
    <ItemForm
      item={item}
      onChange={update}
      referenceSelected={referenceSelected}
    />
  );
}
