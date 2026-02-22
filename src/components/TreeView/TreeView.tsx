import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { CustomTreeViewItem } from "./TreeViewItem";
import { useFilteredTreeItemsValue } from "../../jotai/useTreeItems";
import { useSelectedTreeNodeId } from "../../jotai/useSelectedTreeNode";

export function TreeView() {
  // フック
  const tree = useFilteredTreeItemsValue();
  const [selectedItemId, setSelectedItemId] = useSelectedTreeNodeId();

  // イベントハンドラー
  const getItemId = (item: TreeNode) => item.nodeId;
  const getItemLabel = (item: TreeNode) =>
    (item.type === "item" ? item.data.title : item.title) ?? "---";
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
      items={tree?.children ?? []}
      selectedItems={selectedItemId}
      getItemId={getItemId}
      getItemLabel={getItemLabel}
      isItemSelectionDisabled={isItemSelectionDisabled}
      onItemSelectionToggle={onItemSelectionToggle}
      slots={{ item: CustomTreeViewItem }}
    />
  );
}
