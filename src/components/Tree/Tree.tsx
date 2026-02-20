import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { CustomTreeItem } from "./TreeItem";
import { useSelectedItemId } from "./_useSelectedItemId";
import { useFilteredTreeItemsValue } from "../../jotai/useTreeItems";

export function Tree() {
  // フック
  const tree = useFilteredTreeItemsValue();
  const [selectedItemId, setSelectedItemId] = useSelectedItemId();

  // イベントハンドラー
  const getItemId = (item: TreeNode) => item.nodeId;
  const getItemLabel = (item: TreeNode) => item.title ?? "---";
  const isItemSelectionDisabled = (item: TreeNode) => item.type === "folder";
  const onItemSelectionToggle = (
    _event: React.SyntheticEvent | null,
    itemId: string,
    isSelected: boolean,
  ) => {
    setSelectedItemId(isSelected ? itemId : null);
  };

  return (
    <RichTreeView
      items={tree}
      selectedItems={selectedItemId}
      getItemId={getItemId}
      getItemLabel={getItemLabel}
      isItemSelectionDisabled={isItemSelectionDisabled}
      onItemSelectionToggle={onItemSelectionToggle}
      slots={{ item: CustomTreeItem }}
    />
  );
}
